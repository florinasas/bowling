import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FrameEntity, FrameStatus} from './model/game-model';
import {FrameComponent} from './frame/frame.component';
import {InputText} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FrameComponent, InputText, ButtonModule, FormsModule],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bowlingGame');
  readonly MAX_FRAMES = 10;
  frames: FrameEntity[] = Array.from({length: this.MAX_FRAMES});
  currentFrame: FrameEntity;
  currentFrameIndex = 0;
  previousFrame!: FrameEntity;
  inputRoll!: number;
  inputRoll2!: number;
  inputRoll3!: number;


  constructor() {
    for (let i = 0; i < this.MAX_FRAMES; i++) {
      this.frames[i] = {
        index: i + 1,
        roll1: 0,
        roll2: 0,
        score: 0,
        status: FrameStatus.NEW
      };
    }
    this.currentFrame = this.frames[this.currentFrameIndex];
  }

  updateFrames() {
    let newFrameStatus: FrameStatus = FrameStatus.NEW;


    this.currentFrame.score += this.inputRoll;
    console.log("score " + this.currentFrame.score);
    if (this.currentFrame.score === 10) {
      if (FrameStatus.NEW === this.currentFrame.status) {
        this.currentFrame.status = FrameStatus.STRIKE;
      } else if (FrameStatus.ROLL1 === this.currentFrame.status) {
        this.currentFrame.status = FrameStatus.SPARE;
      }
    } else if (this.currentFrame.score <= 10) {
      if (FrameStatus.NEW === this.currentFrame.status) {
        this.currentFrame.status = FrameStatus.ROLL1;
      } else if (FrameStatus.ROLL1 === this.currentFrame.status) {
        this.currentFrame.status = FrameStatus.ROLL2;
      }
    }

    if (this.previousFrame) {
      if (FrameStatus.SPARE === this.previousFrame.status &&
        (FrameStatus.ROLL1 === this.currentFrame.status || FrameStatus.STRIKE === this.currentFrame.status)) {
        this.previousFrame.score += this.inputRoll;
        this.previousFrame.status = FrameStatus.CLOSED;
      } else if (FrameStatus.STRIKE === this.previousFrame.status) {
        this.previousFrame.score += this.inputRoll;
        if (FrameStatus.ROLL2 === this.currentFrame.status) {
          this.previousFrame.status = FrameStatus.CLOSED
        }
      } else {
        this.previousFrame.status = FrameStatus.CLOSED
      }
    }

    if (FrameStatus.ROLL1 === this.currentFrame.status
      || FrameStatus.STRIKE === this.currentFrame.status) {
      this.currentFrame.roll1 = this.inputRoll;
    } else {
      this.currentFrame.roll2 = this.inputRoll;
    }

    if (FrameStatus.ROLL2 === this.currentFrame.status
      || FrameStatus.SPARE === this.currentFrame.status
      || FrameStatus.STRIKE === this.currentFrame.status) {


      if (this.previousFrame) {
        this.currentFrame.score += this.previousFrame.score;
      }

      this.previousFrame = this.currentFrame;
      this.currentFrameIndex++;
      this.currentFrame = this.frames[this.currentFrameIndex];

    }

  }
}
