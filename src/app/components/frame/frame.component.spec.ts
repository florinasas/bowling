import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FrameComponent} from './frame.component';
import {FrameStatus} from '../../model/game-model';

describe('FrameComponent', () => {
  let component: FrameComponent;
  let fixture: ComponentFixture<FrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrameComponent);
    component = fixture.componentInstance;
    component.frame = {
      index: 0,
      roll1: 10,
      roll2: 0,
      score: 0,
      status: FrameStatus.STRIKE
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply correct class for frameDiv', () => {

    const strikeDiv = fixture.nativeElement.querySelector('.frame-strike');
    expect(strikeDiv).toBeTruthy();
  });
});
