import { MediaPlayer } from "./MediaPlayer";
import { PlayingState } from "./PlayingState";
import { State } from "./State";

export class StoppedState implements State {
    pressPlay(player: MediaPlayer): void {
        console.log("Starting playback...");
        player.setState(new PlayingState());
    }
}