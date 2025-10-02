    // Line Chart (Task Progress)
    const ctx1 = document.getElementById('taskChart').getContext('2d');
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Sep 1', 'Sep 2', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 6', 'Sep 7', 'Sep 8', 'Sep 9', 'Sep 10', 'Sep 11', 'Sep 12'],
        datasets: [{
          label: 'Tasks Completed',
          data: [30, 45, 55, 40, 50, 60, 48, 52, 53, 51, 49, 50],
          borderColor: '#28a745',
          backgroundColor: 'rgba(40,167,69,0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Pie Chart (Employee Region)
    const ctx2 = document.getElementById('regionChart').getContext('2d');
    new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: ['England', 'France', 'Poland'],
        datasets: [{
          data: [4, 4, 2],
          backgroundColor: ['#007bff', '#ff7f50', '#28a745']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
