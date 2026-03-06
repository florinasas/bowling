import {Component} from '@angular/core';
import {FrameEntity, FrameStatus} from '../../model/game-model';
import {FrameComponent} from '../frame/frame.component';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {Toast} from 'primeng/toast';



@Component({
  selector: 'app-game',
  imports: [
    Button,
    FormsModule,
    FrameComponent,
    InputText,
    PrimeTemplate,
    TableModule,
    Toast
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  standalone: true
})
export class GameComponent {

  readonly MAX_FRAMES = 10;
  frames: FrameEntity[] = Array.from({length: this.MAX_FRAMES});
  currentFrame!: FrameEntity;
  currentFrameIndex = 0;
  previousFrame!: FrameEntity | null;
  inputRoll!: number | null;
  isGameOver: boolean = false;
  isBonusRoll: boolean = false;

  constructor(private messageService: MessageService) {
    this.initFrames();
  }

  initFrames() {
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

  //Function to updated current Frame and previous Frame, when a roll is executed
  updateFrames() {

    if (this.inputRoll === null) return;

    //handle extra roll for last Frame if it is STRIKE or SPARE
    if (this.isBonusRoll){
      this.handleBonusRoll(this.inputRoll);
      return;
    }

    if (this.currentFrame.score + this.inputRoll > 10) {
      this.messageService.add({
        severity: 'error',
        detail: 'Roll value too big!',
        life: 3000
      });
      return;
    }

    this.currentFrame.score += this.inputRoll;
    this.currentFrame.status = this.getCurrentFrameStatus();
    this.updatePreviousFrame(this.inputRoll);

    if (FrameStatus.ROLL1 === this.currentFrame.status
      || FrameStatus.STRIKE === this.currentFrame.status) {
      this.currentFrame.roll1 = this.inputRoll;
    } else {
      this.currentFrame.roll2 = this.inputRoll;
    }

    //if the Frame is to be closed
    if (FrameStatus.ROLL2 === this.currentFrame.status
      || FrameStatus.SPARE === this.currentFrame.status
      || FrameStatus.STRIKE === this.currentFrame.status) {

      if (this.previousFrame) {
        this.currentFrame.score += this.previousFrame.score;
      }

      //end game or go to next Frame
      if (this.currentFrameIndex === this.MAX_FRAMES - 1) {

        //allow one more roll
        if (FrameStatus.SPARE !== this.currentFrame.status && FrameStatus.STRIKE !== this.currentFrame.status) {
          this.endGame();
        } else {
          this.isBonusRoll = true;
        }
      } else {
        this.currentFrameIndex++;
        this.previousFrame = this.currentFrame;
        this.currentFrame = this.frames[this.currentFrameIndex];
      }
    }

    //reset input
    this.inputRoll = null;
    this.messageService.clear();
  }


  //Function to calculate the new status of the current Frame according to current roll value and old Frame status
  getCurrentFrameStatus(): FrameStatus {

    let newFrameStatus: FrameStatus = FrameStatus.NEW;

    if (this.currentFrame.score === 10) {
      if (FrameStatus.NEW === this.currentFrame.status) {
        newFrameStatus = FrameStatus.STRIKE;
      } else if (FrameStatus.ROLL1 === this.currentFrame.status) {
        newFrameStatus = FrameStatus.SPARE;
      }
    } else if (this.currentFrame.score <= 10) {
      if (FrameStatus.NEW === this.currentFrame.status) {
        newFrameStatus = FrameStatus.ROLL1;
      } else if (FrameStatus.ROLL1 === this.currentFrame.status) {
        newFrameStatus = FrameStatus.ROLL2;
      }
    }

    return newFrameStatus;
  }

  //Function to update the previous Frame: add bonus in case it was a STRIKE or SPARE and set status
  updatePreviousFrame(inputRoll: number) {

    if (this.previousFrame) {
      if (FrameStatus.SPARE === this.previousFrame.status &&
        (FrameStatus.ROLL1 === this.currentFrame.status || FrameStatus.STRIKE === this.currentFrame.status)) {
        this.previousFrame.score += inputRoll;
        this.previousFrame.status = FrameStatus.CLOSED;
      } else if (FrameStatus.STRIKE === this.previousFrame.status) {
        this.previousFrame.score += inputRoll;
        if (FrameStatus.ROLL1 !== this.currentFrame.status) {
          this.previousFrame.status = FrameStatus.CLOSED
        }
      } else {
        this.previousFrame.status = FrameStatus.CLOSED
      }
    }
  }

  endGame() {
    this.isGameOver = true;
    this.currentFrame.status = FrameStatus.CLOSED;
    this.messageService.add({
      severity: 'success',
      detail: 'Game over!',
      life: 3000
    });
  }

  handleBonusRoll(inputRoll: number){
    this.currentFrame.score += inputRoll;
    this.inputRoll = null;
    this.endGame();
  }

  newGame() {
    this.isGameOver = false;
    this.messageService.clear();
    this.frames = Array.from({length: this.MAX_FRAMES});
    this.currentFrameIndex = 0;
    this.previousFrame = null;
    this.initFrames();
  }
}
