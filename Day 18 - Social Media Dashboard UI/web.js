    // sample dataset - replace with your API fetch
    const sample = [
      {id:'followers',label:'Followers',value:12540,change:2.4,trend:'up',desc:'Since last week',icon: 'followers'},
      {id:'likes',label:'Likes',value:8741,change:-1.2,trend:'down',desc:'This week',icon:'heart'},
      {id:'comments',label:'Comments',value:642,change:8.1,trend:'up',desc:'This week',icon:'comment'},
      {id:'shares',label:'Shares',value:312,change:0.6,trend:'up',desc:'This week',icon:'share'},
      {id:'videoViews',label:'Video Views',value:41230,change:4.9,trend:'up',desc:'24h',icon:'play'},
      {id:'saves',label:'Saves',value:1278,change:-0.4,trend:'down',desc:'This week',icon:'bookmark'}
    ];

    const icons = {
      followers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 21c0-3.866-3.582-7-9-7s-9 3.134-9 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
      heart:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      comment:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      share:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 6l-4-4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2v13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      play:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3v18l15-9L5 3z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      bookmark:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    }

    function formatNumber(n){
      if(n>=1000000) return (n/1000000).toFixed(1)+'M';
      if(n>=1000) return (n/1000).toFixed(1)+'K';
      return String(n);
    }

    function createCard(item){
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div class="top">
          <div class="meta">
            <div class="icon-wrap">${icons[item.icon]}</div>
            <div>
              <div class="label">${item.label}</div>
              <div class="small">${item.desc}</div>
            </div>
          </div>
          <div class="change ${item.trend==='up'? 'up':'down'}">${item.trend==='up'? '▲':'▼'} ${Math.abs(item.change)}%</div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div class="metric" data-val="${item.value}">0</div>
          <div class="small">Compare</div>
        </div>
      `;
      return div;
    }

    function renderCards(dataset){
      const container = document.getElementById('cards');
      container.innerHTML = '';
      dataset.forEach(d=> container.appendChild(createCard(d)));
      // animate numbers
      document.querySelectorAll('.metric').forEach(el=>{
        animateValue(el, 0, +el.getAttribute('data-val'), 900);
      })
    }

    function animateValue(el, start, end, duration){
      const range = end - start;
      let startTime = null;
      function step(timestamp){
        if(!startTime) startTime = timestamp;
        const progress = Math.min((timestamp-startTime)/duration,1);
        const value = Math.floor(start + range*progress);
        el.textContent = formatNumber(value);
        if(progress<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // small simulation: update daily reach and engagement
    function updatePanel(dataset){
      const totalReach = dataset.reduce((s,x)=>s + Math.round(x.value * (Math.random()*0.4 + 0.6)),0);
      const reachValue = Math.floor(totalReach/10);
      const reachBar = Math.min(100, Math.round((reachValue/50000)*100));
      document.getElementById('reachValue').textContent = formatNumber(reachValue);
      document.getElementById('reachBar').style.width = reachBar + '%';

      // engagement = sum of (likes+comments+shares)/reach
      const likes = dataset.find(d=>d.id==='likes')?.value || 0;
      const comments = dataset.find(d=>d.id==='comments')?.value || 0;
      const shares = dataset.find(d=>d.id==='shares')?.value || 0;
      const engagement = Math.max(0, ((likes+comments+shares) / Math.max(reachValue,1)) * 100).toFixed(1);
      document.getElementById('engRate').textContent = engagement + '%';
    }

    // simulate fetching new data (random small changes)
    function simulateNewData(){
      const newData = sample.map(s=> ({...s, value: Math.max(0, Math.round(s.value * (1 + (Math.random()-0.5)/10))), change: (Math.random()*6 - 3).toFixed(1), trend: Math.random()>0.5?'up':'down'}));
      return newData;
    }

    // initial render
    renderCards(sample);
    updatePanel(sample);

    // controls
    document.getElementById('refreshBtn').addEventListener('click', ()=>{
      const d = simulateNewData();
      renderCards(d);
      updatePanel(d);
    });

    document.getElementById('darkToggle').addEventListener('click', ()=>{
      if(document.documentElement.style.getPropertyValue('--bg') === ''){
        document.documentElement.style.setProperty('--bg','#f6f9fc');
        document.documentElement.style.setProperty('--card','#ffffff');
        document.documentElement.style.setProperty('--muted','#446066');
        document.documentElement.style.setProperty('--glass','rgba(0,0,0,0.03)');
        document.body.style.color = '#041428';
        // quick visual tweak (not full theme)
        alert('Quick toggle applied. For a full light theme I can add CSS variables and persist preference.');
      } else {
        // reset - reload page is simplest for full reset
        location.reload();
      }
    });
