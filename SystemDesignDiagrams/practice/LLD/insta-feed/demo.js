'use strict';

const FeedService = require('./FeedService');

const svc = new FeedService({ feedLimit: 1000, backfillLimit: 10 });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function printFeed(label, feedResult) {
  console.log(`\n── ${label} ──`);
  if (feedResult.items.length === 0) {
    console.log('  (empty)');
    return;
  }
  feedResult.items.forEach(p =>
    console.log(`  [@${p.author}] ${p.content}`)
  );
  console.log(`  [page ${feedResult.page}/${Math.ceil(feedResult.total / feedResult.limit)}, total: ${feedResult.total}]`);
}

// ─── 1. Create users ─────────────────────────────────────────────────────────

const alice = svc.createUser('alice');
const bob   = svc.createUser('bob');
const carol = svc.createUser('carol');
const dave  = svc.createUser('dave');
const eve   = svc.createUser('eve');     // eve follows nobody, has no followers

console.log('Users created:', [alice, bob, carol, dave, eve].map(u => u.username));

// ─── 2. Bob and Carol post BEFORE anyone follows them ────────────────────────
// These will be backfilled when alice follows them.

svc.createPost(bob.id,   "Bob's first post 🎸");
svc.createPost(carol.id, "Carol's announcement 📢");
svc.createPost(bob.id,   "Bob's second post 🌊");

// ─── 3. Set up follow graph ───────────────────────────────────────────────────
//
//   alice  → follows bob, carol
//   bob    → follows carol
//   dave   → follows alice
//   eve    → follows nobody

svc.follow(alice.id, bob.id);
svc.follow(alice.id, carol.id);
svc.follow(bob.id,   carol.id);
svc.follow(dave.id,  alice.id);

console.log('\nFollow graph set up.');
console.log('  alice follows:', svc.getFollowing(alice.id).map(u => u.username));
console.log('  bob   follows:', svc.getFollowing(bob.id).map(u => u.username));
console.log('  dave  follows:', svc.getFollowing(dave.id).map(u => u.username));

// ─── 4. New posts after follows are established ───────────────────────────────

svc.createPost(alice.id, "Alice just went live! 🎉");
svc.createPost(carol.id, "Carol's new recipe 🍕");

// ─── 5. Read feeds ────────────────────────────────────────────────────────────

// alice follows bob + carol:
//   backfilled  → bob's 1st, carol's announcement, bob's 2nd
//   live fanout → alice's own post, carol's new recipe
printFeed("Alice's feed", svc.getFeed(alice.id));

// bob follows carol:
//   backfilled  → carol's announcement
//   live fanout → bob's own new post (none), carol's new recipe
printFeed("Bob's feed", svc.getFeed(bob.id));

// dave follows alice only — gets alice's post (live), nothing backfilled from alice
printFeed("Dave's feed", svc.getFeed(dave.id));

// carol doesn't follow anyone but her own posts appear in her feed
printFeed("Carol's feed", svc.getFeed(carol.id));

// eve follows nobody and posted nothing
printFeed("Eve's feed (empty)", svc.getFeed(eve.id));

// ─── 6. Unfollow: alice unfollows carol ──────────────────────────────────────

console.log('\n──── Alice unfollows Carol ────');
svc.unfollow(alice.id, carol.id);
printFeed("Alice's feed (after unfollow)", svc.getFeed(alice.id));

// ─── 7. Delete a post ─────────────────────────────────────────────────────────

console.log('\n──── Bob deletes his second post ────');
const bobPosts = svc.userPosts.get(bob.id);
svc.deletePost(bobPosts[0].id); // newest = "Bob's second post"

printFeed("Alice's feed (after delete)", svc.getFeed(alice.id));
printFeed("Bob's feed   (after delete)", svc.getFeed(bob.id));

// ─── 8. Pagination demo ───────────────────────────────────────────────────────

console.log('\n──── Pagination: create 25 posts from carol ────');
// re-follow carol so alice gets the posts
svc.follow(alice.id, carol.id);
for (let i = 1; i <= 25; i++) {
  svc.createPost(carol.id, `Carol's post #${i}`);
}

const page1 = svc.getFeed(alice.id, { page: 1, limit: 5 });
const page2 = svc.getFeed(alice.id, { page: 2, limit: 5 });
printFeed('Alice page 1 (limit 5)', page1);
printFeed('Alice page 2 (limit 5)', page2);

// ─── 9. Stats ─────────────────────────────────────────────────────────────────

console.log('\n──── Stats ────');
console.table(svc.getStats());
