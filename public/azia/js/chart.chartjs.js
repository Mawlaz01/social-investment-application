$(function(){
  'use strict';

  /* BAR CHART */
  var ctx5 = document.getElementById('chartBar5');
  if (ctx5) {
    new Chart(ctx5.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          data: [12, 15, 18, 40, 35, 38, 32, 20, 25, 15, 25, 30],
          backgroundColor: '#37B7C3' // Warna biru tua untuk semua data pada dataset pertama
        }, {
          data: [10, 20, 25, 55, 50, 45, 35, 30, 45, 35, 55, 40],
          backgroundColor: '#071952' // Warna biru terang untuk semua data pada dataset kedua
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{ ticks: { beginAtZero: true, fontSize: 11 } }],
          yAxes: [{ ticks: { beginAtZero: true, fontSize: 11, max: 80 } }]
        }
      }
    });
  }
  
  /** AREA CHART 1 **/
  var ctx9 = document.getElementById('chartArea1');
  if (ctx9) {
    var gradient1 = ctx9.getContext('2d').createLinearGradient(0, 350, 0, 0);
    gradient1.addColorStop(0, 'rgba(7, 25, 82, 0)');   // Warna biru tua transparan
    gradient1.addColorStop(1, 'rgba(7, 25, 82, 0.3)'); // Warna biru tua dengan sedikit transparansi    

    new Chart(ctx9.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          data: [12, 15, 18, 40, 35, 38, 32, 20, 25, 15, 25, 30],
          borderColor: '#071952',
          borderWidth: 1,
          backgroundColor: gradient1
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true, fontSize: 10, max: 80 } }],
          xAxes: [{ ticks: { beginAtZero: true, fontSize: 11 } }]
        }
      }
    });
  }

/** AREA CHART 2 **/
var ctx10 = document.getElementById('chartArea2');
if (ctx10) {
  var gradient1 = ctx10.getContext('2d').createLinearGradient(0, 350, 0, 0);
  gradient1.addColorStop(0, 'rgba(0,123,255,0)');
  gradient1.addColorStop(1, 'rgba(0,123,255,.3)');

  new Chart(ctx10.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        data: [10, 20, 25, 55, 50, 45, 35, 30, 45, 35, 55, 40],
        borderColor: '#007bff',
        borderWidth: 1,
        backgroundColor: gradient1
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { beginAtZero: true, fontSize: 10, max: 80 } }],
        xAxes: [{ ticks: { beginAtZero: true, fontSize: 11 } }]
      }
    }
  });
}

  /* LINE CHART */
  var ctx8 = document.getElementById('chartLine1');
  if (ctx8) {
    new Chart(ctx8, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          data: [12, 15, 18, 40, 35, 38, 32, 20, 25, 15, 25, 30],
          borderColor: '#f10075',
          borderWidth: 1,
          fill: false
        }, {
          data: [10, 20, 25, 55, 50, 45, 35, 30, 45, 35, 55, 40],
          borderColor: '#007bff',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true, fontSize: 10, max: 80 } }],
          xAxes: [{ ticks: { beginAtZero: true, fontSize: 11 } }]
        }
      }
    });
  }

});
