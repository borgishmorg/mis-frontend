import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  loading = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.isLoading.subscribe((loading) => {
      this.loading = loading;
    });
  }
}
