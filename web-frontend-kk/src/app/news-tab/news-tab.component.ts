import { Component,inject,Input } from '@angular/core';
import { SharedDataService } from './../shared-data.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-tab',
  templateUrl: './news-tab.component.html',
  styleUrl: './news-tab.component.css'
})


export class NewsTabComponent {

  // stockNewsData: any;
  private modalService = inject(NgbModal);
  public company_news:any = [];

  constructor(private stockData: SharedDataService) {}

  ngOnInit(){
    
    this.stockData.newsData.subscribe( data => {
      // console.log("==============")
      // console.log(data)
      var c=1;
      this.company_news=[]
      if(data.length){
        // this.stockNewsData=data
        var news_length=data[0].length
        for (let i=0;i<news_length;i++) {
          if(c>20){
            break;
          }
          if (data[0][i].image.length > 0 && data[0][i].headline.length >0 && data[0][i].url.length && ( data[0][i].datetime > 0 || data[0][i].datetime != null)) {
            this.company_news.push(data[0][i]);
            c=c+1;
            // console.log("CHeck")
          }
        }
      }
    })
  }

  // CALLING THE MODAL
  ExploreNews(news:any) {
		const modalRef = this.modalService.open(NgbdModalContent);
    console.log(news)
		modalRef.componentInstance.news = news;
	}
}

@Component({
	selector: 'ngbd-modal-content',
	// standalone: true,
	template: `
  <div class="container">
    <div class="modal-header">
      <h4 class="modal-title">{{ news["source"] }}</h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <div class="news-modal-headline">{{ news.headline }}</div>
      <div class="news-modal-summary text-small">{{ news.summary }}</div>
      <p class="news-link-line">For more details click <a href="{{ news.url }}" target="_blank">here</a></p>
      <div class="card news-share-card">
        <div class="card-body">
          <div style="font-size:15px">Share</div>
          <div style="margin-top: 10px;margin-bottom: 10px;">
            <!-- <a href="{{news.url}}" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-twitter-x" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
            </a> -->
            <a class="twitter-share-button" target="_blank"
                href="https://twitter.com/intent/tweet?text={{news.headline}} {{news.url}}" >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="share-btt  bi bi-twitter-x" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
            </a>
            <!-- <div class="fb-share-button" data-href="https://nEWS.com" data-layout="" data-size=""> -->
              <!-- <a target="_blank" href="https://www.facebook.com/sharer/sharer?u={{news.url}}">Share</a> -->
          <!-- </div> -->
            <a target="_blank" href="https://www.facebook.com/sharer/sharer?u={{news.url}}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="share-btt bi bi-facebook" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
              </svg>
            </a>
            
          </div>
          <!-- <button>Facebook</a></button> -->
        </div>
      </div>
    </div>
  </div>
	`,
  styleUrl: './news-tab.component.css'
})

export class NgbdModalContent {
	// activeModal = inject(NgbActiveModal);
	@Input() news:any ;

  constructor(public activeModal: NgbActiveModal) {}

  // ngOnInit(){
  //   console.log(this.news)
  // }

}

