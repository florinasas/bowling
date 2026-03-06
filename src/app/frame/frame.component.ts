import {Component, Input} from '@angular/core';
import {FrameEntity, FrameStatus} from '../model/game-model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-frame',
  imports: [
    NgClass
  ],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.css',
  standalone: true
})
export class FrameComponent {
  @Input({required: true}) frame!: FrameEntity;

  isNew() {
    return FrameStatus.NEW === this.frame.status;
  }

  isClosed() {
    return FrameStatus.CLOSED === this.frame.status;
  }

  isSpare() {
    return FrameStatus.SPARE === this.frame.status;
  }

  isStrike() {
    return FrameStatus.STRIKE === this.frame.status;
  }

  isRoll1() {
    return FrameStatus.ROLL1 === this.frame.status;
  }

  isRoll2() {
    return FrameStatus.ROLL2 === this.frame.status;
  }
}
