    const SIMPLEX_LOGO_DATA_URI = 'data:image/png;base64,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';

    function escapeSidePyramidText(value) {
      return String(value).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function drawLabeledSidePyramid(svgId, data, title) {
      const svg = document.getElementById(svgId);
      if (!svg) return;

      const colors = ['#C4B5FD', '#93E4F2', '#A7F3D0', '#FDE68A', '#FDBA74', '#FCA5A5'];
      const W = 900;
      const topY = 72;
      const bottomY = 518;
      const centerX = 565;
      const topHalf = 270;
      const levels = data.length;
      const levelH = (bottomY - topY) / levels;
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const chartId = svgId;

      function halfWidthAt(y) {
        const t = (y - topY) / (bottomY - topY);
        return topHalf * (1 - t);
      }

      let shapes = '';
      let labels = '';


      function semanticStatusColor(label, fallbackColor) {
        const value = String(label || '').toLowerCase();
        if (value.includes('hired') || value.includes('admitted')) return '#86EFAC';
        if (value.includes('rejected') || value.includes('lost') || value.includes('withdrawn')) return '#FCA5A5';
        if (value.includes('new application') || value.includes('new admission') || value.includes('new enquiry') || value.includes('in review')) return '#BFDBFE';
        if (value.includes('tour scheduled')) return '#FDBA74';
        if (value.includes('interview scheduled')) return '#A5B4FC';
        if (value.includes('pending') || value.includes('cold / no response') || value.includes('no response') || value.includes('not talked')) return '#FDE68A';
        if (value.includes('hot lead') || value.includes('interviewed') || value.includes('interview')) return '#C4B5FD';
        return fallbackColor;
      }

      function semanticClasses(label) {
        const value = String(label || '').toLowerCase();
        if (value.includes('hired') || value.includes('admitted')) {
          return { rect: 'fill-green-50 stroke-green-200', text: 'fill-green-700' };
        }
        if (value.includes('rejected') || value.includes('lost') || value.includes('withdrawn')) {
          return { rect: 'fill-red-50 stroke-red-200', text: 'fill-red-700' };
        }
        if (value.includes('new application') || value.includes('new admission') || value.includes('new enquiry') || value.includes('in review')) {
          return { rect: 'fill-blue-50 stroke-blue-200', text: 'fill-blue-700' };
        }
        if (value.includes('hot lead') || value.includes('interview')) {
          return { rect: 'fill-violet-50 stroke-violet-200', text: 'fill-violet-700' };
        }
        if (value.includes('tour scheduled')) {
          return { rect: 'fill-orange-50 stroke-orange-200', text: 'fill-orange-700' };
        }
        if (value.includes('interview scheduled')) {
          return { rect: 'fill-indigo-50 stroke-indigo-200', text: 'fill-indigo-700' };
        }
        if (value.includes('pending') || value.includes('cold / no response') || value.includes('no response') || value.includes('not talked')) {
          return { rect: 'fill-yellow-50 stroke-yellow-200', text: 'fill-yellow-700' };
        }
        return { rect: 'fill-white stroke-slate-200', text: 'fill-slate-600' };
      }

      data.forEach((item, i) => {
        const y1 = topY + i * levelH;
        const y2 = topY + (i + 1) * levelH;
        const hw1 = halfWidthAt(y1);
        const hw2 = halfWidthAt(y2);
        const x1l = centerX - hw1;
        const x1r = centerX + hw1;
        const x2l = centerX - hw2;
        const x2r = centerX + hw2;
        const color = semanticStatusColor(item.label, colors[i % colors.length]);
        const midY = (y1 + y2) / 2;
        const bandWidth = hw1 * 2;
        const fontSize = bandWidth > 340 ? 22 : bandWidth > 250 ? 18 : bandWidth > 170 ? 14 : 11;
        const percent = Math.round((item.value / total) * 100);

        shapes += `
          <polygon points="${x1l},${y1} ${x1r},${y1} ${x2r},${y2} ${x2l},${y2}" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
        `;

        const labelBoxX = 58;
        const labelBoxW = 188;
        const labelBoxH = 32;
        const connectorX = centerX - hw1 - 8;
        const semantic = semanticClasses(item.label);
        const segmentTextColor = '#111827';
        const segmentSubTextColor = 'rgba(17,24,39,0.72)';
        labels += `
          <line x1="${labelBoxX + labelBoxW + 8}" y1="${midY}" x2="${connectorX}" y2="${midY}" stroke="#D7DFEA" stroke-width="1.2"/>
          <rect class="${semantic.rect}" x="${labelBoxX}" y="${midY - labelBoxH / 2}" width="${labelBoxW}" height="${labelBoxH}" rx="17" stroke-width="1"/>
          <text class="${semantic.text}" x="${labelBoxX + 16}" y="${midY}" dominant-baseline="middle" text-anchor="start" font-size="12" font-weight="700">${escapeSidePyramidText(item.label)}</text>
          <text x="${centerX}" y="${midY - 2}" text-anchor="middle" fill="${segmentTextColor}" font-size="${fontSize}" font-weight="800">${item.value}</text>
          <text x="${centerX}" y="${midY + 17}" text-anchor="middle" fill="${segmentSubTextColor}" font-size="10" font-weight="650">${percent}%</text>
        `;
      });

      const outerPath = `M ${centerX - topHalf} ${topY} L ${centerX + topHalf} ${topY} L ${centerX} ${bottomY} Z`;

      svg.innerHTML = `
        <defs>
          <filter id="shadow-${chartId}" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#0F172A" flood-opacity="0.08"/>
          </filter>
        </defs>
        <image href="${SIMPLEX_LOGO_DATA_URI}" x="716" y="8" width="160" height="54" preserveAspectRatio="xMidYMid meet" opacity="0.96"/>
        <g filter="url(#shadow-${chartId})">
          ${shapes}
          <path d="${outerPath}" fill="none" stroke="#5B6472" stroke-width="2"/>
        </g>
        ${labels}
      `;
    }

    function renderDashboardSidePyramids() {
      drawLabeledSidePyramid('admissionsSidePyramid', [
        { label: 'New Admission', value: 842 },
        { label: 'Hot Lead', value: 615 },
        { label: 'Tour Scheduled', value: 342 },
        { label: 'Cold / No Response', value: 184 },
        { label: 'Lost / Withdrawn', value: 254 },
        { label: 'Admitted', value: 47 }
      ], 'Admissions Labeled Side Pyramid');

      drawLabeledSidePyramid('jobsSidePyramid', [
        { label: 'New Application', value: 238 },
        { label: 'Interview Scheduled', value: 86 },
        { label: 'Interviewed', value: 156 },
        { label: 'Have Not Talked', value: 124 },
        { label: 'Rejected', value: 94 },
        { label: 'Hired', value: 22 }
      ], 'Jobs Labeled Side Pyramid');
    }

    document.addEventListener('alpine:initialized', () => setTimeout(renderDashboardSidePyramids, 0));
    document.addEventListener('DOMContentLoaded', () => setTimeout(renderDashboardSidePyramids, 50));

    /* Dashboard UI from HTML File 2 funnel support */
    function escapeText(value) { return String(value).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c])); }
    function drawHighlightFunnel(svgId, data) {
      const svg = document.getElementById(svgId); if (!svg) return;
      const width = 900, stageH = 52, gap = 1, chartH = 350, centerX = 570, labelCenterX = 120, labelW = 220;
      const maxValue = Math.max(...data.map(item => item.value));
      const totalH = data.length * stageH + (data.length - 1) * gap;
      const topY = Math.max(4, (chartH - totalH) / 2);
      let markup = '<defs><filter id="funnel-shadow-' + svgId + '" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.08"/></filter></defs>';
      data.forEach((item, i) => {
        const y = topY + i * (stageH + gap);
        const ratio = Math.max(item.value / maxValue, 0.16);
        const nextRatio = data[i + 1] ? Math.max(data[i + 1].value / maxValue, 0.16) : Math.max(ratio * 0.68, 0.11);
        const topW = 640 * ratio;
        const bottomW = 640 * nextRatio;
        const x1 = centerX - topW / 2, x2 = centerX + topW / 2, x3 = centerX + bottomW / 2, x4 = centerX - bottomW / 2;
        const midY = y + stageH / 2;
        const pct = Math.round((item.value / maxValue) * 100);
        markup += `<g class="funnel-stage" aria-label="${escapeText(item.label)} ${item.value} ${pct}%">
          <polygon class="stage-shape" points="${x1},${y} ${x2},${y} ${x3},${y + stageH} ${x4},${y + stageH}" fill="${item.color}" stroke="rgba(255,255,255,.95)" stroke-width="1.4" filter="url(#funnel-shadow-${svgId})"/>
          <text x="${centerX}" y="${midY}" text-anchor="middle" dominant-baseline="middle" fill="#111827" font-size="18" font-weight="800">${item.value}</text>
          <text x="${labelCenterX}" y="${midY}" dominant-baseline="middle" text-anchor="middle" fill="#111827" font-size="12.5" font-weight="750">${escapeText(item.label)}</text>
        </g>`;
      });
      svg.innerHTML = markup;
    }
    function renderFunnels() {
      drawHighlightFunnel('admissionsFunnel', [
        { label: 'New Enquiries', value: 842, color: '#7DB7FF', labelBg: '#EFF6FF', labelStroke: '#BFDBFE', labelText: '#1D4ED8' },
        { label: 'Hot Leads', value: 615, color: '#A58AF2', labelBg: '#F5F3FF', labelStroke: '#DDD6FE', labelText: '#6D28D9' },
        { label: 'Tour Scheduled', value: 342, color: '#F2B24E', labelBg: '#FFF7ED', labelStroke: '#FED7AA', labelText: '#C2410C' },
        { label: 'Cold / No Response', value: 184, color: '#E6C944', labelBg: '#FEFCE8', labelStroke: '#FEF08A', labelText: '#A16207' },
        { label: 'Rejected', value: 71, color: '#EC7F7F', labelBg: '#FEF2F2', labelStroke: '#FECACA', labelText: '#B91C1C' },
        { label: 'Admitted', value: 47, color: '#5FD48C', labelBg: '#F0FDF4', labelStroke: '#BBF7D0', labelText: '#15803D' }
      ]);
      drawHighlightFunnel('jobsFunnel', [
        { label: 'New Applications', value: 238, color: '#7DB7FF', labelBg: '#EFF6FF', labelStroke: '#BFDBFE', labelText: '#1D4ED8' },
        { label: 'Interview Scheduled', value: 182, color: '#F2B24E', labelBg: '#FFF7ED', labelStroke: '#FED7AA', labelText: '#C2410C' },
        { label: 'Shortlisted', value: 156, color: '#A58AF2', labelBg: '#F5F3FF', labelStroke: '#DDD6FE', labelText: '#6D28D9' },
        { label: 'Have Not Talked', value: 124, color: '#E6C944', labelBg: '#FEFCE8', labelStroke: '#FEF08A', labelText: '#A16207' },
        { label: 'Rejected', value: 94, color: '#EC7F7F', labelBg: '#FEF2F2', labelStroke: '#FECACA', labelText: '#B91C1C' },
        { label: 'Hired / Placed', value: 22, color: '#5FD48C', labelBg: '#F0FDF4', labelStroke: '#BBF7D0', labelText: '#15803D' }
      ]);
    }
    document.addEventListener('DOMContentLoaded', () => setTimeout(renderFunnels, 80));
    document.addEventListener('alpine:initialized', () => setTimeout(renderFunnels, 0));


    function polarToCartesian(cx, cy, r, angle) {
      const rad = (angle - 90) * Math.PI / 180;
      return { x: cx + (r * Math.cos(rad)), y: cy + (r * Math.sin(rad)) };
    }
    function describeArc(cx, cy, r, startAngle, endAngle) {
      const start = polarToCartesian(cx, cy, r, endAngle);
      const end = polarToCartesian(cx, cy, r, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
    }
    function drawMobilePie(svgId, data) {
      const svg = document.getElementById(svgId); if (!svg) return;
      const total = data.reduce((sum, item) => sum + item.value, 0);
      let start = 0;
      const slices = data.map((item) => {
        const angle = (item.value / total) * 360;
        const end = start + angle;
        const path = describeArc(100, 100, 88, start, end);
        const pct = Math.round(item.value / total * 100);
        const out = `<path class="pie-slice" d="${path}" fill="${item.color}" stroke="#ffffff" stroke-width="2" aria-label="${escapeText(item.label)} ${item.value} ${pct}%"><title>${escapeText(item.label)}: ${item.value} (${pct}%)</title></path>`;
        start = end;
        return out;
      }).join('');
      svg.innerHTML = `<g>${slices}</g><circle class="pie-hole" cx="100" cy="100" r="48"></circle>`;
    }
    function renderMobilePies() {
      drawMobilePie('admissionsMobilePie', [
        { label: 'New Enquiries', value: 842, color: '#7DB7FF' },
        { label: 'Hot Leads', value: 615, color: '#A58AF2' },
        { label: 'Tour Scheduled', value: 342, color: '#F2B24E' },
        { label: 'Cold / No Response', value: 184, color: '#E6C944' },
        { label: 'Rejected', value: 71, color: '#EC7F7F' },
        { label: 'Admitted', value: 47, color: '#5FD48C' }
      ]);
      drawMobilePie('jobsMobilePie', [
        { label: 'New Applications', value: 238, color: '#7DB7FF' },
        { label: 'Interview Scheduled', value: 182, color: '#F2B24E' },
        { label: 'Shortlisted', value: 156, color: '#A58AF2' },
        { label: 'Have Not Talked', value: 124, color: '#E6C944' },
        { label: 'Rejected', value: 94, color: '#EC7F7F' },
        { label: 'Hired / Placed', value: 22, color: '#5FD48C' }
      ]);
    }
    document.addEventListener('DOMContentLoaded', () => setTimeout(renderMobilePies, 90));
    document.addEventListener('alpine:initialized', () => setTimeout(renderMobilePies, 0));
