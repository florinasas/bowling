import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameComponent} from './game.component';
import {FrameStatus} from '../../model/game-model';
import {MessageService} from 'primeng/api';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [MessageService]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 10 Frames', () => {
    expect(component.frames.length).toBe(10);
  });

  it('should have first Frame with status STRIKE', () => {
    component.currentFrame.score = 10;
    component.currentFrame.status = component.getCurrentFrameStatus();
    expect(component.frames[0].status).toBe(FrameStatus.STRIKE);
  });

  it('should have first Frame with status SPARE', () => {
    component.currentFrame.status = FrameStatus.ROLL1;
    component.currentFrame.score = 10;
    component.currentFrame.status = component.getCurrentFrameStatus();
    expect(component.frames[0].status).toBe(FrameStatus.SPARE);
  });

  it('should calculate Bonus', () => {
    component.previousFrame = component.frames[0];
    component.currentFrame = component.frames[1];
    component.previousFrame.score = 24;
    component.previousFrame.status = FrameStatus.SPARE;

    component.currentFrame.status = FrameStatus.ROLL1;
    component.currentFrame.score = 5;
    component.updatePreviousFrame(5);
    expect(component.frames[0].status).toBe(FrameStatus.CLOSED);
    expect(component.frames[0].score).toBe(29);
  });
});
