import { Component, OnInit, OnDestroy } from '@angular/core';
import { Server } from '../../shared/server'
import { ServerService } from '../../services/server.service';
import { Observable, Subscription, timer } from 'rxjs';
import { ServerMessage } from 'src/app/shared/server-message';

/* const SAMPLE_SERVER = [
  {id: 1, name: 'dev-web', isOnline: true},
  {id: 2, name: 'dev-mail', isOnline: false},
  {id: 3, name: 'prod-web', isOnline: true},
  {id: 4, name: 'prod-mail', isOnline: false}

] */

@Component({
  selector: 'app-section-health',
  templateUrl: './section-health.component.html',
  styleUrls: ['./section-health.component.css']
})
export class SectionHealthComponent implements OnInit {

  constructor(private _serverService: ServerService) { }

  servers: Server[];
  timerSubscription: Subscription;
  

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription)
    {
      this.timerSubscription.unsubscribe();
      console.log('Destroyed Subscription');
    }
  }

  refreshData() {
    this._serverService.getServer().subscribe(res => {
      this.servers = res;
    });

    this.subscribeToData();
  }

  subscribeToData() {
    this.timerSubscription = timer(5000).subscribe(x => this.refreshData());
    console.log('complete');
  }

  sendMessage(msg: ServerMessage) {
    this._serverService.handleServerMessage(msg)
    .subscribe(res => console.log(res), err => console.log(err));
  }
}
