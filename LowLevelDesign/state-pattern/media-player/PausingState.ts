import { MediaPlayer } from "./MediaPlayer";
import { PlayingState } from "./PlayingState";
import { State } from "./State";

export class PausedState implements State {
    pressPlay(player: MediaPlayer): void {
        console.log("Resuming playback...");
        player.setState(new PlayingState());
    }
}