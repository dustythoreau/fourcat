function getTimezone() {
  var
    tz = {};
    m = (new Date()).getTimezoneOffset();
  
  tz.h = Math.ceil(m / 60);
  tz.m = m % (tz.h * 60);
  if (tz.m == 0) {
    tz.mStr = '00';
  }
  else {
    tz.mStr = '' + tz.m;
  }
  if (tz.h < 0) {
    tz.sign = '+';
    tz.hAbs = tz.h * -1;
    if (tz.h > -10) {
      tz.hStr = '0' + tz.hAbs;
    }
    else {
      tz.hStr = '' + tz.hAbs;
    }
  }
  else {
    tz.sign = '-';
    tz.hAbs = tz.h
    if (tz.h < 10) {
      tz.hStr = '0' + tz.h;
    }
    else {
      tz.hStr = '' + tz.h;
    }
  }
  tz.oStr = 'UTC' + tz.sign + tz.hStr + ':' + tz.mStr;
  return tz;
}

function plotGroup(id, container, stats, group) {
  var div = document.createElement('div');
  div.id = 'stats-tier-' + id;
  div.setAttribute('class', 'chart');
  container.appendChild(div);
  
  if (group) {
    groupstats = {};
    for (var i = group.length - 1; i >= 0; i--) {
      if (stats[group[i]]) {
        groupstats[group[i]] = stats[group[i]];
      }
    }
    plotStats(groupstats, 'stats-tier-' + id);
  }
  else {
    plotStats(stats, 'stats-tier-' + id);
  }
}

function plotStats(stats, container, labels) {
  if (stats == false) {
    return $(document.getElementById(container)).addClass('nodata').html('No Data');
  }
  
  var labels = labels || {};
  labels.h = labels.h || 'Time ';
  labels.v = labels.v || 'New Threads';
  
  google.load('visualization', '1', {packages:['corechart']});
  google.setOnLoadCallback(draw);
  function draw() {
    var
      data = new google.visualization.DataTable(),
      tz = getTimezone(),
      rows = row = [], i = 0, h = 0;
    
    data.addColumn('string', 'Hours');
    for (var board in stats) {
      data.addColumn('number', board);
    }
    for (var j = tz.h; j < 24 + tz.h; j++) {
      if (j < 0) {
        h = 24 + j;
      }
      else if (j > 23) {
        h = j - 24;
      }
      else {
        h = j;
      }
      row = [ (i < 10 ? '0' + i : i) + ':00' ];
      for (var board in stats) {
        row.push(stats[board][h] ? parseInt(stats[board][h]) : 0);
      }
      rows.push(row);
      ++i;
    }
    data.addRows(rows);
    new google.visualization.LineChart(document.getElementById(container))
      .draw(data, {
        hAxis: { title: labels.h + tz.oStr },
        vAxis: { title: labels.v },
        tooltipTextStyle: { fontSize: 11 },
        pointSize: 5,
        width: 960,
        height: 400,
        //curveType: 'function',
        chartArea: { left: 70, top: 40, width: 800, height: 280 }
      }
    );
  }
}
