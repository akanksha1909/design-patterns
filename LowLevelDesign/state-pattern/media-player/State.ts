import { MediaPlayer } from "./MediaPlayer";

export interface State {
    pressPlay(player: MediaPlayer): void
}