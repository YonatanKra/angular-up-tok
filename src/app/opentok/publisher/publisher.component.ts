import {Component, ElementRef, AfterViewInit, ViewChild, Input} from '@angular/core';
import {OpentokService} from '../opentok.service';

const publish = () => {

};

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})

export class PublisherComponent implements AfterViewInit {
  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  @Input() session: OT.Session;
  publisher: OT.Publisher;
  publishing: boolean;
  @Input()
  public publisherName: string = ['John', 'Miriam', 'Sunny', 'Sid'][Math.round(Math.random() * 3)];

  constructor(private opentokService: OpentokService) {
    this.publishing = false;
  }

  ngAfterViewInit(): void {
    const OT = this.opentokService.getOT();
    this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {insertMode: 'append', name: this.publisherName});

    if (this.session) {
      if (this.session['isConnected']()) {
        this.publish();
      }
      this.session.on('sessionConnected', () => this.publish());
    }
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }

  changeName(): void {
    this.publisher.stream.name = this.publisherName;
    this.session.publish(this.publisher);
  }
}
