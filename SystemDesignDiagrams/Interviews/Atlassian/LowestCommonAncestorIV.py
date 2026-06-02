class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def dfs(self, node, nodes):
        if not node: return None

        if node in nodes: return node

        foundLeft = self.dfs(node.left, nodes)
        foundRight = self.dfs(node.right, nodes)

        if foundLeft and foundRight: return node
        foundAny = foundLeft or foundRight
        return foundAny
        

    def lowestCommonAncestor(self, root, nodes):
        nodes = set(nodes)
        return self.dfs(root, nodes)
    
s = Solution()
root = TreeNode(3)
root.left = TreeNode(5)
root.right = TreeNode(1)
root.left.left = TreeNode(6)
root.left.right = TreeNode(2)
root.left.right.left = TreeNode(7)
root.left.right.right = TreeNode(4)

nodes = [root.left.right.right,root.left.right.left]
print(s.lowestCommonAncestor(root, nodes).val)