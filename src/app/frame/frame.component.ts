import {Component, Input} from '@angular/core';
import {FrameEntity} from '../model/game-model';

@Component({
  selector: 'app-frame',
  imports: [],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.css',
  standalone: true
})
export class FrameComponent {
  @Input({required: true}) frame!: FrameEntity;

}
