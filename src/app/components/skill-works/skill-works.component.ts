import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CeoService } from 'src/app/services/ceo.service';
@Component({
  selector: 'ms-skill-works',
  templateUrl: './skill-works.component.html',
  styleUrls: ['./skill-works.component.scss']
})
export class SkillWorksComponent implements OnInit {
  @ViewChild('player') player: any;
  @Input('ID_VIDEO') ID_VIDEO: string;
  @Input('description') description: string;
  video: any;
  isPlay = false;
  isMuted = false;
  isHandler = false;
  renderVideo: boolean = false;
  // ID_VIDEO = '1';
  constructor(private el: ElementRef, private ceoService: CeoService) { }

  ngOnInit(): void {
    if (this.ceoService.checkUserAgentBot()) this.renderVideo = false;
    else this.renderVideo = true;
  }

  onReady() {
    this.player.unMute();         
    this.player.stopVideo();    
  }

  onStateChange(event) {
    if (event.data === 0) {
      this.player.playVideo();  
    }
  }

  actionVideo() {
    this.isPlay = !this.isPlay;
    this.isPlay ? this.player.playVideo() : this.player.stopVideo();
    if (this.isHandler) this.player.unMute();
    this.isHandler = true;
  }

  actionMute() {
    this.isMuted = !this.isMuted;
    this.isMuted ? this.player.mute() : this.player.unMute();
  }

}
