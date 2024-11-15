$(function(){
  'use strict';

/* BAR CHART PERBANDINGAN */
const chartBarElement = document.getElementById('chartBar5');
if (chartBarElement) {
    const labels = JSON.parse(chartBarElement.getAttribute('data-labels'));
    const data1 = JSON.parse(chartBarElement.getAttribute('data-data1'));
    const data2 = JSON.parse(chartBarElement.getAttribute('data-data2'));

    new Chart(chartBarElement.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data2,
                backgroundColor: '#37B7C3'
            }, {
                data: data1,
                backgroundColor: '#071952'
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: { display: false },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 10,
                        max: 10
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 11,
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }]
            }
        }
    });
}

/** AREA CHART TOTAL USER **/
const chartElementUser = document.getElementById('chartDataUser');
if (chartElementUser) {
  const labelsUser = JSON.parse(chartElementUser.getAttribute('data-labels'));
  const dataUser = JSON.parse(chartElementUser.getAttribute('data-data'));

  var ctx10 = document.getElementById('chartArea2');
  if (ctx10) {
    var gradientUser = ctx10.getContext('2d').createLinearGradient(0, 350, 0, 0);
    gradientUser.addColorStop(0, 'rgba(0,123,255,0)');
    gradientUser.addColorStop(1, 'rgba(0,123,255,.3)');

    new Chart(ctx10.getContext('2d'), {
      type: 'line',
      data: {
        labels: labelsUser,
        datasets: [{
          data: dataUser,
          borderColor: '#007bff',
          borderWidth: 1,
          backgroundColor: gradientUser
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontSize: 10,
              max: 10
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              fontSize: 11,
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45
            }
          }]
        }
      }
    });
  }
}

/** AREA CHART TOTAL ACARA **/
const chartElementAcara = document.getElementById('chartDataAcara');
if (chartElementAcara) {
  const labelsAcara = JSON.parse(chartElementAcara.getAttribute('data-labels2'));
  const dataAcara = JSON.parse(chartElementAcara.getAttribute('data-data2'));

  var ctx9 = document.getElementById('chartArea1');
  if (ctx9) {
    var gradientAcara = ctx9.getContext('2d').createLinearGradient(0, 350, 0, 0);
    gradientAcara.addColorStop(0, 'rgba(7, 25, 82, 0)');
    gradientAcara.addColorStop(1, 'rgba(7, 25, 82, 0.3)');

    new Chart(ctx9.getContext('2d'), {
      type: 'line',
      data: {
        labels: labelsAcara,
        datasets: [{
          data: dataAcara,
          borderColor: '#071952',
          borderWidth: 1,
          backgroundColor: gradientAcara
        }]
      },
      options: {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontSize: 10,
              max: 10
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              fontSize: 11,
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45
            }
          }]
        }
      }
    });
  }
}
});
