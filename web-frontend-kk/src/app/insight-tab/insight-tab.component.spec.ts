import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightTabComponent } from './insight-tab.component';

describe('InsightTabComponent', () => {
  let component: InsightTabComponent;
  let fixture: ComponentFixture<InsightTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsightTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
