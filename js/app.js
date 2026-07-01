// =============================================
// APP STATE
// =============================================
const App = {
  currentView: 'dashboard',
  currentEstimate: null,
  estimates: [],
  invoices: [],
  subscription: null,
  companyInfo: {},
  lineItems: [],

  init() {
    this.loadData();
    this.checkSubscription();
    this.render();
  },

  loadData() {
    try {
      this.estimates = JSON.parse(localStorage.getItem('ce_estimates') || '[]');
      this.invoices = JSON.parse(localStorage.getItem('ce_invoices') || '[]');
      this.companyInfo = JSON.parse(localStorage.getItem('ce_company') || '{}');
      this.subscription = JSON.parse(localStorage.getItem('ce_subscription') || 'null');
    } catch(e) { console.warn('Load error', e); }
  },

  saveData() {
    localStorage.setItem('ce_estimates', JSON.stringify(this.estimates));
    localStorage.setItem('ce_invoices', JSON.stringify(this.invoices));
    localStorage.setItem('ce_company', JSON.stringify(this.companyInfo));
    localStorage.setItem('ce_subscription', JSON.stringify(this.subscription));
  },

  checkSubscription() {
    if (!this.subscription) {
      // Check for trial/demo mode
      const installed = localStorage.getItem('ce_install_date');
      if (!installed) {
        localStorage.setItem('ce_install_date', Date.now());
      }
      const days = Math.floor((Date.now() - parseInt(localStorage.getItem('ce_install_date'))) / 86400000);
      this.trialDaysLeft = Math.max(0, 14 - days);
    }
  },

  isSubscribed() {
    return this.subscription && this.subscription.active;
  },

  canUseApp() {
    return this.isSubscribed() || (this.trialDaysLeft > 0);
  },

  render() {
    const root = document.getElementById('app');
    if (!this.canUseApp() && this.currentView !== 'subscribe' && this.currentView !== 'settings') {
      this.currentView = 'subscribe';
    }
    root.innerHTML = this.buildLayout();
    this.attachEventListeners();
  },

  buildLayout() {
    return `
      <div class="app-shell">
        ${this.buildTopBar()}
        <main class="main-content">
          ${this.buildView()}
        </main>
        ${this.buildBottomNav()}
      </div>
    `;
  },

  buildTopBar() {
    const titles = {
      dashboard: 'Dashboard',
      new_estimate: this.currentEstimate ? `Edit Estimate` : 'New Estimate',
      estimates: 'My Estimates',
      invoices: 'My Invoices',
      settings: 'Settings',
      subscribe: 'Subscription',
      estimate_detail: 'Estimate Detail',
      invoice_detail: 'Invoice Detail',
    };
    return `
      <header class="top-bar">
        <div class="top-bar-left">
          ${this.currentView !== 'dashboard' ? `<button class="btn-icon back-btn" onclick="App.goBack()">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
          </button>` : `<div class="app-logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#FF6B35"/><path d="M8 22V14l8-6 8 6v8H19v-5h-6v5H8z" fill="white"/><rect x="13" y="19" width="6" height="5" rx="1" fill="#FF6B35"/></svg>
          </div>`}
        </div>
        <h1 class="top-bar-title">${titles[this.currentView] || 'ContractorPro'}</h1>
        <div class="top-bar-right">
          ${!this.isSubscribed() && this.currentView !== 'subscribe' ? `<span class="trial-badge">${this.trialDaysLeft}d trial</span>` : ''}
          ${this.currentView === 'estimate_detail' && this.currentEstimate ? 
            `<button class="btn-icon" onclick="App.convertToInvoice()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </button>` : ''}
        </div>
      </header>
    `;
  },

  buildBottomNav() {
    const navItems = [
      { view: 'dashboard', icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`, label: 'Home' },
      { view: 'estimates', icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`, label: 'Estimates' },
      { view: 'new_estimate', icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`, label: 'New', fab: true },
      { view: 'invoices', icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`, label: 'Invoices' },
      { view: 'settings', icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`, label: 'Settings' },
    ];

    return `
      <nav class="bottom-nav">
        ${navItems.map(item => `
          <button class="nav-item ${item.fab ? 'nav-fab' : ''} ${this.currentView === item.view ? 'active' : ''}"
            onclick="App.navigate('${item.view}')">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
          </button>
        `).join('')}
      </nav>
    `;
  },

  buildView() {
    switch(this.currentView) {
      case 'dashboard': return this.viewDashboard();
      case 'new_estimate': return this.viewNewEstimate();
      case 'estimates': return this.viewEstimates();
      case 'invoices': return this.viewInvoices();
      case 'settings': return this.viewSettings();
      case 'subscribe': return this.viewSubscribe();
      case 'estimate_detail': return this.viewEstimateDetail();
      case 'invoice_detail': return this.viewInvoiceDetail();
      default: return this.viewDashboard();
    }
  },

  // =============================================
  // DASHBOARD VIEW
  // =============================================
  viewDashboard() {
    const totalEstimated = this.estimates.reduce((s, e) => s + (e.total || 0), 0);
    const totalInvoiced = this.invoices.reduce((s, i) => s + (i.total || 0), 0);
    const totalPaid = this.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0);
    const recentEstimates = [...this.estimates].sort((a, b) => b.date - a.date).slice(0, 3);
    const company = this.companyInfo.name || 'Your Company';

    return `
      <div class="view-dashboard">
        <div class="dashboard-hero">
          <div class="hero-greeting">
            <p class="hero-sub">Welcome back</p>
            <h2 class="hero-name">${company}</h2>
          </div>
          <button class="btn-new-estimate" onclick="App.navigate('new_estimate')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Estimate
          </button>
        </div>

        <div class="stats-grid">
          <div class="stat-card accent-orange">
            <div class="stat-label">Estimated</div>
            <div class="stat-value">${this.formatCurrency(totalEstimated)}</div>
            <div class="stat-sub">${this.estimates.length} estimates</div>
          </div>
          <div class="stat-card accent-blue">
            <div class="stat-label">Invoiced</div>
            <div class="stat-value">${this.formatCurrency(totalInvoiced)}</div>
            <div class="stat-sub">${this.invoices.length} invoices</div>
          </div>
          <div class="stat-card accent-green">
            <div class="stat-label">Collected</div>
            <div class="stat-value">${this.formatCurrency(totalPaid)}</div>
            <div class="stat-sub">${this.invoices.filter(i => i.status === 'paid').length} paid</div>
          </div>
          <div class="stat-card accent-purple">
            <div class="stat-label">Outstanding</div>
            <div class="stat-value">${this.formatCurrency(totalInvoiced - totalPaid)}</div>
            <div class="stat-sub">${this.invoices.filter(i => i.status !== 'paid').length} pending</div>
          </div>
        </div>

        ${recentEstimates.length ? `
          <div class="section-block">
            <div class="section-header">
              <h3>Recent Estimates</h3>
              <button class="btn-link" onclick="App.navigate('estimates')">See all</button>
            </div>
            ${recentEstimates.map(est => this.buildEstimateCard(est)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No estimates yet</h3>
            <p>Tap "New Estimate" to create your first quote</p>
          </div>
        `}

        <div class="section-block">
          <h3>Contractor Trades</h3>
          <div class="trade-pills">
            ${Object.entries(TRADES).map(([key, trade]) => `
              <button class="trade-pill" onclick="App.startEstimateWithTrade('${key}')">
                <span>${trade.icon}</span>
                <span>${trade.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // =============================================
  // NEW ESTIMATE VIEW
  // =============================================
  viewNewEstimate() {
    const est = this.currentEstimate || this.blankEstimate();
    
    return `
      <div class="view-estimate-builder">
        <!-- CLIENT INFO -->
        <div class="form-section">
          <h3 class="section-title">Client Information</h3>
          <div class="form-row">
            <input class="form-input" id="client_name" placeholder="Client Name *" value="${est.clientName || ''}" onchange="App.updateEstField('clientName', this.value)">
          </div>
          <div class="form-row">
            <input class="form-input" id="client_email" placeholder="Email" type="email" value="${est.clientEmail || ''}" onchange="App.updateEstField('clientEmail', this.value)">
          </div>
          <div class="form-row">
            <input class="form-input" id="client_phone" placeholder="Phone" type="tel" value="${est.clientPhone || ''}" onchange="App.updateEstField('clientPhone', this.value)">
          </div>
          <div class="form-row">
            <input class="form-input" id="project_address" placeholder="Project Address" value="${est.projectAddress || ''}" onchange="App.updateEstField('projectAddress', this.value)">
          </div>
          <div class="form-row-split">
            <input class="form-input" id="project_city" placeholder="City" value="${est.projectCity || ''}" onchange="App.updateEstField('projectCity', this.value)">
            <input class="form-input zip-input" id="project_zip" placeholder="ZIP Code" maxlength="5" value="${est.projectZip || ''}" 
              onchange="App.updateEstField('projectZip', this.value); App.onZipChange(this.value)">
          </div>
          ${est.projectZip ? `<div class="zip-info">📍 Regional multiplier: <strong>${(getMultiplier(est.projectZip) * 100).toFixed(0)}%</strong> of national average</div>` : ''}
        </div>

        <!-- PROJECT INFO -->
        <div class="form-section">
          <h3 class="section-title">Project Details</h3>
          <div class="form-row">
            <input class="form-input" id="project_name" placeholder="Project Name / Description *" value="${est.projectName || ''}" onchange="App.updateEstField('projectName', this.value)">
          </div>
          <div class="form-row-split">
            <select class="form-input" id="trade_type" onchange="App.updateEstField('tradeType', this.value); App.render()">
              <option value="">Select Trade Type</option>
              ${Object.entries(TRADES).map(([key, t]) => `
                <option value="${key}" ${est.tradeType === key ? 'selected' : ''}>${t.icon} ${t.label}</option>
              `).join('')}
            </select>
            <select class="form-input" id="est_status" onchange="App.updateEstField('status', this.value)">
              <option value="draft" ${est.status === 'draft' ? 'selected' : ''}>Draft</option>
              <option value="sent" ${est.status === 'sent' ? 'selected' : ''}>Sent</option>
              <option value="approved" ${est.status === 'approved' ? 'selected' : ''}>Approved</option>
              <option value="declined" ${est.status === 'declined' ? 'selected' : ''}>Declined</option>
            </select>
          </div>
          <div class="form-row">
            <textarea class="form-input form-textarea" id="project_notes" placeholder="Project notes / scope description..." 
              onchange="App.updateEstField('notes', this.value)">${est.notes || ''}</textarea>
          </div>
          <div class="form-row-split">
            <div class="form-group">
              <label class="form-label">Valid Until</label>
              <input class="form-input" type="date" id="valid_until" value="${est.validUntil || ''}" onchange="App.updateEstField('validUntil', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Est. Start Date</label>
              <input class="form-input" type="date" id="start_date" value="${est.startDate || ''}" onchange="App.updateEstField('startDate', this.value)">
            </div>
          </div>
        </div>

        <!-- LINE ITEMS -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">Line Items</h3>
            <button class="btn-add" onclick="App.showItemPicker()">+ Add Item</button>
          </div>

          ${est.tradeType && TRADES[est.tradeType] ? `
            <div class="quick-add-bar">
              <p class="quick-add-label">Quick add from ${TRADES[est.tradeType].label}:</p>
              <div class="quick-add-categories">
                ${TRADES[est.tradeType].categories.map((cat, ci) => `
                  <button class="quick-cat-btn" onclick="App.showCategoryItems('${est.tradeType}', ${ci})">
                    ${cat.name}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div id="line-items-list">
            ${(est.lineItems || []).length === 0 ? `
              <div class="empty-items">
                <p>No line items yet. Add items above or pick a trade type for quick-add options.</p>
              </div>
            ` : `
              ${est.lineItems.map((item, idx) => this.buildLineItemRow(item, idx)).join('')}
            `}
          </div>

          <button class="btn-add-custom" onclick="App.addCustomItem()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Custom Line Item
          </button>
        </div>

        <!-- PRICING SETTINGS -->
        <div class="form-section">
          <h3 class="section-title">Pricing Settings</h3>
          <div class="form-row-split">
            <div class="form-group">
              <label class="form-label">Overhead %</label>
              <input class="form-input" type="number" min="0" max="50" value="${est.overhead ?? DEFAULT_OVERHEAD}" 
                onchange="App.updateEstField('overhead', parseFloat(this.value)); App.recalculate()">
            </div>
            <div class="form-group">
              <label class="form-label">Profit Margin %</label>
              <input class="form-input" type="number" min="0" max="50" value="${est.profit ?? DEFAULT_PROFIT}" 
                onchange="App.updateEstField('profit', parseFloat(this.value)); App.recalculate()">
            </div>
          </div>
          <div class="form-row-split">
            <div class="form-group">
              <label class="form-label">Sales Tax % (materials)</label>
              <input class="form-input" type="number" min="0" max="15" step="0.1" value="${est.taxRate ?? DEFAULT_TAX_RATE}" 
                onchange="App.updateEstField('taxRate', parseFloat(this.value)); App.recalculate()">
            </div>
            <div class="form-group">
              <label class="form-label">Deposit Required %</label>
              <input class="form-input" type="number" min="0" max="100" value="${est.depositPct ?? 30}" 
                onchange="App.updateEstField('depositPct', parseFloat(this.value)); App.recalculate()">
            </div>
          </div>
        </div>

        <!-- TOTALS -->
        <div class="totals-card" id="totals-section">
          ${this.buildTotalsHTML(est)}
        </div>

        <!-- TERMS -->
        <div class="form-section">
          <h3 class="section-title">Terms & Conditions</h3>
          <textarea class="form-input form-textarea" id="terms" 
            onchange="App.updateEstField('terms', this.value)"
            placeholder="Payment terms, warranty info, scope exclusions...">${est.terms || this.defaultTerms()}</textarea>
        </div>

        <!-- ACTIONS -->
        <div class="action-buttons">
          <button class="btn-primary" onclick="App.saveEstimate()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Estimate
          </button>
          <button class="btn-secondary" onclick="App.previewEstimate()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview PDF
          </button>
          <button class="btn-secondary" onclick="App.convertToInvoice()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Convert to Invoice
          </button>
        </div>

        <!-- ITEM PICKER MODAL -->
        <div id="item-picker-modal" class="modal hidden">
          <div class="modal-backdrop" onclick="App.closeModal()"></div>
          <div class="modal-sheet" id="modal-sheet-content">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
    `;
  },

  buildLineItemRow(item, idx) {
    const subtotal = (item.qty || 0) * (item.unitPrice || 0);
    return `
      <div class="line-item-row" data-idx="${idx}">
        <div class="line-item-top">
          <div class="line-item-name-wrap">
            <input class="li-name" value="${this.escHtml(item.name)}" placeholder="Item name"
              onchange="App.updateLineItem(${idx}, 'name', this.value)">
            <span class="li-trade-badge">${item.tradeLabel || ''}</span>
          </div>
          <button class="li-delete" onclick="App.removeLineItem(${idx})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
        <div class="line-item-bottom">
          <div class="li-field">
            <label>Qty</label>
            <input type="number" min="0" step="0.01" value="${item.qty || 1}" 
              onchange="App.updateLineItem(${idx}, 'qty', parseFloat(this.value)); App.recalculate()">
          </div>
          <div class="li-field">
            <label>Unit</label>
            <select onchange="App.updateLineItem(${idx}, 'unit', this.value)">
              ${Object.entries(UNIT_LABELS).map(([k, v]) => `<option value="${k}" ${item.unit === k ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          <div class="li-field">
            <label>Unit Price</label>
            <div class="li-price-wrap">
              <span>$</span>
              <input type="number" min="0" step="0.01" value="${item.unitPrice || 0}" 
                onchange="App.updateLineItem(${idx}, 'unitPrice', parseFloat(this.value)); App.recalculate()">
            </div>
          </div>
          <div class="li-subtotal">
            <label>Subtotal</label>
            <span>${this.formatCurrency(subtotal)}</span>
          </div>
        </div>
        <div class="li-split-row">
          <div class="li-toggle-wrap">
            <label class="li-toggle-label">Labor</label>
            <span class="li-pct">${Math.round((item.laborPct || 0.6) * 100)}%</span>
          </div>
          <div class="li-toggle-wrap">
            <label class="li-toggle-label">Materials</label>
            <span class="li-pct">${Math.round((1 - (item.laborPct || 0.6)) * 100)}%</span>
          </div>
          <div class="li-field">
            <label>Labor %</label>
            <input type="number" min="0" max="100" value="${Math.round((item.laborPct || 0.6) * 100)}"
              onchange="App.updateLineItem(${idx}, 'laborPct', this.value/100); App.recalculate()">
          </div>
        </div>
        ${item.notes ? `<div class="li-notes">${item.notes}</div>` : ''}
      </div>
    `;
  },

  buildTotalsHTML(est) {
    const calcs = this.calculateTotals(est);
    return `
      <div class="totals-inner">
        <div class="totals-row"><span>Labor Subtotal</span><span>${this.formatCurrency(calcs.laborSubtotal)}</span></div>
        <div class="totals-row"><span>Materials Subtotal</span><span>${this.formatCurrency(calcs.materialsSubtotal)}</span></div>
        <div class="totals-divider"></div>
        <div class="totals-row"><span>Base Subtotal</span><span>${this.formatCurrency(calcs.baseSubtotal)}</span></div>
        <div class="totals-row muted"><span>Overhead (${est.overhead ?? DEFAULT_OVERHEAD}%)</span><span>${this.formatCurrency(calcs.overheadAmount)}</span></div>
        <div class="totals-row muted"><span>Profit Margin (${est.profit ?? DEFAULT_PROFIT}%)</span><span>${this.formatCurrency(calcs.profitAmount)}</span></div>
        <div class="totals-row muted"><span>Materials Tax (${est.taxRate ?? DEFAULT_TAX_RATE}%)</span><span>${this.formatCurrency(calcs.taxAmount)}</span></div>
        <div class="totals-divider"></div>
        <div class="totals-row total"><span>TOTAL</span><span>${this.formatCurrency(calcs.total)}</span></div>
        <div class="totals-row deposit"><span>Required Deposit (${est.depositPct ?? 30}%)</span><span>${this.formatCurrency(calcs.depositAmount)}</span></div>
        <div class="totals-row"><span>Balance Due</span><span>${this.formatCurrency(calcs.balanceDue)}</span></div>
        ${est.projectZip ? `<div class="totals-note">💡 Prices adjusted for ZIP ${est.projectZip} (${(getMultiplier(est.projectZip)*100).toFixed(0)}% regional rate)</div>` : ''}
      </div>
    `;
  },

  calculateTotals(est) {
    const mult = getMultiplier(est.projectZip || '');
    const items = est.lineItems || [];
    let laborSubtotal = 0, materialsSubtotal = 0;
    
    items.forEach(item => {
      const lineTotal = (item.qty || 0) * (item.unitPrice || 0);
      const lp = item.laborPct ?? 0.6;
      laborSubtotal += lineTotal * lp;
      materialsSubtotal += lineTotal * (1 - lp);
    });

    // Apply regional multiplier
    laborSubtotal *= mult;
    materialsSubtotal *= mult;

    const baseSubtotal = laborSubtotal + materialsSubtotal;
    const overheadPct = (est.overhead ?? DEFAULT_OVERHEAD) / 100;
    const profitPct = (est.profit ?? DEFAULT_PROFIT) / 100;
    const taxPct = (est.taxRate ?? DEFAULT_TAX_RATE) / 100;

    const overheadAmount = baseSubtotal * overheadPct;
    const profitAmount = (baseSubtotal + overheadAmount) * profitPct;
    const taxAmount = materialsSubtotal * taxPct;
    const total = baseSubtotal + overheadAmount + profitAmount + taxAmount;
    const depositPct = (est.depositPct ?? 30) / 100;
    const depositAmount = total * depositPct;
    const balanceDue = total - depositAmount;

    return { laborSubtotal, materialsSubtotal, baseSubtotal, overheadAmount, profitAmount, taxAmount, total, depositAmount, balanceDue };
  },

  // =============================================
  // ESTIMATES LIST VIEW
  // =============================================
  viewEstimates() {
    const sorted = [...this.estimates].sort((a, b) => b.date - a.date);
    return `
      <div class="view-list">
        <div class="list-filter-bar">
          <input class="search-input" placeholder="🔍 Search estimates..." oninput="App.filterEstimates(this.value)" id="est-search">
          <select class="filter-select" onchange="App.filterEstimatesByStatus(this.value)">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <div id="estimates-list-container">
          ${sorted.length === 0 ? `<div class="empty-state"><div class="empty-icon">📋</div><h3>No estimates yet</h3><p>Create your first estimate to get started</p></div>` :
            sorted.map(est => this.buildEstimateCard(est, true)).join('')
          }
        </div>
      </div>
    `;
  },

  buildEstimateCard(est, showActions = false) {
    const statusColors = { draft: '#888', sent: '#2196F3', approved: '#4CAF50', declined: '#F44336' };
    const calcs = this.calculateTotals(est);
    return `
      <div class="list-card" onclick="App.openEstimate('${est.id}')">
        <div class="card-top">
          <div class="card-info">
            <h4 class="card-title">${this.escHtml(est.projectName || 'Untitled Project')}</h4>
            <p class="card-sub">${this.escHtml(est.clientName || 'No client')} · ${est.projectZip ? est.projectCity + ', ' + est.projectZip : ''}</p>
            <p class="card-meta">${this.formatDate(est.date)} · ${TRADES[est.tradeType]?.icon || '🔨'} ${TRADES[est.tradeType]?.label || 'General'}</p>
          </div>
          <div class="card-right">
            <div class="card-amount">${this.formatCurrency(calcs.total)}</div>
            <span class="status-badge" style="background:${statusColors[est.status] || '#888'}20; color:${statusColors[est.status] || '#888'}">
              ${est.status || 'draft'}
            </span>
          </div>
        </div>
        ${showActions ? `
          <div class="card-actions" onclick="event.stopPropagation()">
            <button class="card-btn" onclick="App.editEstimate('${est.id}')">Edit</button>
            <button class="card-btn" onclick="App.duplicateEstimate('${est.id}')">Duplicate</button>
            <button class="card-btn" onclick="App.convertEstimateToInvoice('${est.id}')">→ Invoice</button>
            <button class="card-btn danger" onclick="App.deleteEstimate('${est.id}')">Delete</button>
          </div>
        ` : ''}
      </div>
    `;
  },

  // =============================================
  // INVOICES LIST VIEW
  // =============================================
  viewInvoices() {
    const sorted = [...this.invoices].sort((a, b) => b.date - a.date);
    return `
      <div class="view-list">
        <div class="list-filter-bar">
          <input class="search-input" placeholder="🔍 Search invoices..." id="inv-search">
          <select class="filter-select" onchange="App.filterInvoicesByStatus(this.value)">
            <option value="">All Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div id="invoices-list-container">
          ${sorted.length === 0 ? `<div class="empty-state"><div class="empty-icon">📄</div><h3>No invoices yet</h3><p>Convert an estimate to create your first invoice</p></div>` :
            sorted.map(inv => this.buildInvoiceCard(inv)).join('')
          }
        </div>
      </div>
    `;
  },

  buildInvoiceCard(inv) {
    const statusColors = { unpaid: '#FF6B35', partial: '#FF9800', paid: '#4CAF50', overdue: '#F44336' };
    const isPastDue = inv.dueDate && new Date(inv.dueDate) < new Date() && inv.status !== 'paid';
    const displayStatus = isPastDue && inv.status !== 'paid' ? 'overdue' : (inv.status || 'unpaid');
    return `
      <div class="list-card" onclick="App.openInvoice('${inv.id}')">
        <div class="card-top">
          <div class="card-info">
            <h4 class="card-title">Invoice #${inv.number || inv.id.slice(-6).toUpperCase()}</h4>
            <p class="card-sub">${this.escHtml(inv.clientName || 'No client')} · ${this.escHtml(inv.projectName || '')}</p>
            <p class="card-meta">Issued: ${this.formatDate(inv.date)}${inv.dueDate ? ' · Due: ' + inv.dueDate : ''}</p>
          </div>
          <div class="card-right">
            <div class="card-amount">${this.formatCurrency(inv.total || 0)}</div>
            <span class="status-badge" style="background:${statusColors[displayStatus] || '#888'}20; color:${statusColors[displayStatus] || '#888'}">
              ${displayStatus}
            </span>
          </div>
        </div>
        <div class="card-actions" onclick="event.stopPropagation()">
          <button class="card-btn" onclick="App.markInvoicePaid('${inv.id}')">Mark Paid</button>
          <button class="card-btn" onclick="App.printInvoice('${inv.id}')">Print/PDF</button>
          <button class="card-btn danger" onclick="App.deleteInvoice('${inv.id}')">Delete</button>
        </div>
      </div>
    `;
  },

  // =============================================
  // ESTIMATE DETAIL VIEW
  // =============================================
  viewEstimateDetail() {
    const est = this.currentEstimate;
    if (!est) return '<div class="empty-state">Estimate not found</div>';
    const calcs = this.calculateTotals(est);
    const trade = TRADES[est.tradeType];

    return `
      <div class="view-detail">
        <div class="detail-header">
          <div class="detail-number">ESTIMATE #${est.id.slice(-6).toUpperCase()}</div>
          <div class="detail-date">${this.formatDate(est.date)}</div>
        </div>

        ${this.buildCompanyHeader()}
        
        <div class="detail-parties">
          <div class="detail-party">
            <div class="party-label">Bill To:</div>
            <div class="party-name">${this.escHtml(est.clientName)}</div>
            <div class="party-address">${this.escHtml(est.projectAddress || '')}</div>
            <div class="party-address">${this.escHtml(est.projectCity || '')}${est.projectZip ? ', ' + est.projectZip : ''}</div>
            ${est.clientEmail ? `<div class="party-contact">${this.escHtml(est.clientEmail)}</div>` : ''}
            ${est.clientPhone ? `<div class="party-contact">${this.escHtml(est.clientPhone)}</div>` : ''}
          </div>
          <div class="detail-party">
            <div class="party-label">Project:</div>
            <div class="party-name">${this.escHtml(est.projectName)}</div>
            ${trade ? `<div class="party-trade">${trade.icon} ${trade.label}</div>` : ''}
            ${est.validUntil ? `<div class="party-contact">Valid Until: ${est.validUntil}</div>` : ''}
            ${est.startDate ? `<div class="party-contact">Est. Start: ${est.startDate}</div>` : ''}
          </div>
        </div>

        ${est.notes ? `<div class="detail-notes"><strong>Project Scope:</strong> ${this.escHtml(est.notes)}</div>` : ''}

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${(est.lineItems || []).map(item => {
              const mult = getMultiplier(est.projectZip || '');
              const adjustedPrice = (item.unitPrice || 0) * mult;
              const total = (item.qty || 0) * adjustedPrice;
              return `
                <tr>
                  <td class="item-name-cell">${this.escHtml(item.name)}${item.tradeLabel ? `<span class="item-trade-tag">${item.tradeLabel}</span>` : ''}</td>
                  <td class="right">${item.qty || 0}</td>
                  <td>${UNIT_LABELS[item.unit] || item.unit || ''}</td>
                  <td class="right">${this.formatCurrency(adjustedPrice)}</td>
                  <td class="right">${this.formatCurrency(total)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="detail-totals">
          <div class="dt-row"><span>Labor</span><span>${this.formatCurrency(calcs.laborSubtotal)}</span></div>
          <div class="dt-row"><span>Materials</span><span>${this.formatCurrency(calcs.materialsSubtotal)}</span></div>
          <div class="dt-row"><span>Overhead (${est.overhead ?? DEFAULT_OVERHEAD}%)</span><span>${this.formatCurrency(calcs.overheadAmount)}</span></div>
          <div class="dt-row"><span>Profit Margin (${est.profit ?? DEFAULT_PROFIT}%)</span><span>${this.formatCurrency(calcs.profitAmount)}</span></div>
          <div class="dt-row"><span>Tax (materials)</span><span>${this.formatCurrency(calcs.taxAmount)}</span></div>
          <div class="dt-row dt-total"><span>TOTAL</span><span>${this.formatCurrency(calcs.total)}</span></div>
          <div class="dt-row dt-deposit"><span>Deposit Required (${est.depositPct ?? 30}%)</span><span>${this.formatCurrency(calcs.depositAmount)}</span></div>
          <div class="dt-row"><span>Balance Due on Completion</span><span>${this.formatCurrency(calcs.balanceDue)}</span></div>
        </div>

        ${est.terms ? `<div class="detail-terms"><h4>Terms & Conditions</h4><p>${this.escHtml(est.terms)}</p></div>` : ''}

        <div class="action-buttons">
          <button class="btn-primary" onclick="App.editEstimate('${est.id}')">
            ✏️ Edit Estimate
          </button>
          <button class="btn-secondary" onclick="App.printDoc('estimate')">
            🖨️ Print / Save PDF
          </button>
          <button class="btn-secondary" onclick="App.convertEstimateToInvoice('${est.id}')">
            📄 Convert to Invoice
          </button>
        </div>
      </div>
    `;
  },

  // =============================================
  // INVOICE DETAIL VIEW
  // =============================================
  viewInvoiceDetail() {
    const inv = this.currentInvoice;
    if (!inv) return '<div class="empty-state">Invoice not found</div>';

    return `
      <div class="view-detail">
        <div class="detail-header">
          <div class="detail-number">INVOICE #${inv.number || inv.id.slice(-6).toUpperCase()}</div>
          <div class="detail-date">Date: ${this.formatDate(inv.date)}</div>
          ${inv.dueDate ? `<div class="detail-due">Due: ${inv.dueDate}</div>` : ''}
        </div>

        ${this.buildCompanyHeader()}

        <div class="detail-parties">
          <div class="detail-party">
            <div class="party-label">Bill To:</div>
            <div class="party-name">${this.escHtml(inv.clientName)}</div>
            <div class="party-address">${this.escHtml(inv.projectAddress || '')}</div>
            ${inv.clientEmail ? `<div class="party-contact">${this.escHtml(inv.clientEmail)}</div>` : ''}
            ${inv.clientPhone ? `<div class="party-contact">${this.escHtml(inv.clientPhone)}</div>` : ''}
          </div>
          <div class="detail-party">
            <div class="party-label">Project:</div>
            <div class="party-name">${this.escHtml(inv.projectName)}</div>
            ${inv.estimateId ? `<div class="party-contact">From Estimate #${inv.estimateId.slice(-6).toUpperCase()}</div>` : ''}
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr><th>Description</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${(inv.lineItems || []).map(item => {
              const mult = getMultiplier(inv.projectZip || '');
              const adjustedPrice = (item.unitPrice || 0) * mult;
              const total = (item.qty || 0) * adjustedPrice;
              return `<tr>
                <td>${this.escHtml(item.name)}</td>
                <td class="right">${item.qty || 0}</td>
                <td>${UNIT_LABELS[item.unit] || item.unit || ''}</td>
                <td class="right">${this.formatCurrency(adjustedPrice)}</td>
                <td class="right">${this.formatCurrency(total)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>

        <div class="detail-totals">
          ${inv.laborSubtotal ? `<div class="dt-row"><span>Labor</span><span>${this.formatCurrency(inv.laborSubtotal)}</span></div>` : ''}
          ${inv.materialsSubtotal ? `<div class="dt-row"><span>Materials</span><span>${this.formatCurrency(inv.materialsSubtotal)}</span></div>` : ''}
          ${inv.overheadAmount ? `<div class="dt-row"><span>Overhead</span><span>${this.formatCurrency(inv.overheadAmount)}</span></div>` : ''}
          ${inv.profitAmount ? `<div class="dt-row"><span>Profit</span><span>${this.formatCurrency(inv.profitAmount)}</span></div>` : ''}
          ${inv.taxAmount ? `<div class="dt-row"><span>Tax</span><span>${this.formatCurrency(inv.taxAmount)}</span></div>` : ''}
          <div class="dt-row dt-total"><span>TOTAL DUE</span><span>${this.formatCurrency(inv.total || 0)}</span></div>
          ${inv.depositAmount ? `<div class="dt-row"><span>Deposit Paid</span><span>- ${this.formatCurrency(inv.depositAmount)}</span></div>` : ''}
          ${inv.depositAmount ? `<div class="dt-row dt-deposit"><span>BALANCE DUE</span><span>${this.formatCurrency((inv.total||0) - (inv.depositAmount||0))}</span></div>` : ''}
        </div>

        ${inv.paymentInfo || this.companyInfo.paymentInfo ? `
          <div class="detail-terms">
            <h4>Payment Instructions</h4>
            <p>${this.escHtml(inv.paymentInfo || this.companyInfo.paymentInfo || '')}</p>
          </div>
        ` : ''}

        <div class="action-buttons">
          <button class="btn-primary" onclick="App.markInvoicePaid('${inv.id}'); App.render()">
            ✅ Mark as Paid
          </button>
          <button class="btn-secondary" onclick="App.printDoc('invoice')">
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>
    `;
  },

  buildCompanyHeader() {
    const c = this.companyInfo;
    if (!c.name) return `<div class="company-header-empty"><p>Add your company info in Settings</p></div>`;
    return `
      <div class="company-header">
        ${c.logo ? `<img src="${c.logo}" class="company-logo" alt="Logo">` : `<div class="company-logo-placeholder">🏗️</div>`}
        <div class="company-details">
          <div class="company-name">${this.escHtml(c.name)}</div>
          ${c.address ? `<div class="company-meta">${this.escHtml(c.address)}</div>` : ''}
          ${c.phone ? `<div class="company-meta">${this.escHtml(c.phone)}</div>` : ''}
          ${c.email ? `<div class="company-meta">${this.escHtml(c.email)}</div>` : ''}
          ${c.license ? `<div class="company-meta">License #${this.escHtml(c.license)}</div>` : ''}
          ${c.website ? `<div class="company-meta">${this.escHtml(c.website)}</div>` : ''}
        </div>
      </div>
    `;
  },

  // =============================================
  // SETTINGS VIEW
  // =============================================
  viewSettings() {
    const c = this.companyInfo;
    return `
      <div class="view-settings">
        <div class="form-section">
          <h3 class="section-title">Company Profile</h3>
          <div class="form-row">
            <input class="form-input" placeholder="Company Name *" value="${c.name || ''}" 
              onchange="App.updateCompany('name', this.value)">
          </div>
          <div class="form-row">
            <input class="form-input" placeholder="Street Address" value="${c.address || ''}" 
              onchange="App.updateCompany('address', this.value)">
          </div>
          <div class="form-row-split">
            <input class="form-input" placeholder="City" value="${c.city || ''}" 
              onchange="App.updateCompany('city', this.value)">
            <input class="form-input" placeholder="State" value="${c.state || ''}" 
              onchange="App.updateCompany('state', this.value)">
            <input class="form-input" placeholder="ZIP" value="${c.zip || ''}" 
              onchange="App.updateCompany('zip', this.value)">
          </div>
          <div class="form-row">
            <input class="form-input" placeholder="Phone" type="tel" value="${c.phone || ''}" 
              onchange="App.updateCompany('phone', this.value)">
          </div>
          <div class="form-row">
            <input class="form-input" placeholder="Email" type="email" value="${c.email || ''}" 
              onchange="App.updateCompany('email', this.value)">
          </div>
          <div class="form-row">
            <input class="form-input" placeholder="Website" value="${c.website || ''}" 
              onchange="App.updateCompany('website', this.value)">
          </div>
          <div class="form-row">
            <input class="form-input" placeholder="Contractor License #" value="${c.license || ''}" 
              onchange="App.updateCompany('license', this.value)">
          </div>
          <div class="form-row">
            <input class="form-input" placeholder="Insurance / Bond #" value="${c.insurance || ''}" 
              onchange="App.updateCompany('insurance', this.value)">
          </div>
          <div class="form-row">
            <textarea class="form-input form-textarea" placeholder="Payment instructions (e.g. Check payable to..., Zelle: 555-xxx...)" 
              onchange="App.updateCompany('paymentInfo', this.value)">${c.paymentInfo || ''}</textarea>
          </div>
          <button class="btn-primary" onclick="App.saveCompanyInfo()">Save Company Info</button>
        </div>

        <div class="form-section">
          <h3 class="section-title">Subscription</h3>
          ${this.isSubscribed() ? `
            <div class="sub-active">
              <div class="sub-check">✅ Active Subscription</div>
              <p>Your subscription is active. Thank you!</p>
              <button class="btn-secondary" onclick="App.navigate('subscribe')">Manage Subscription</button>
            </div>
          ` : `
            <div class="sub-trial">
              <p>${this.trialDaysLeft > 0 ? `You have <strong>${this.trialDaysLeft} days</strong> left in your free trial.` : 'Your free trial has ended.'}</p>
              <p>Subscribe for <strong>$5.99/month</strong> for unlimited estimates and invoices.</p>
              <button class="btn-primary" onclick="App.navigate('subscribe')">Subscribe Now</button>
            </div>
          `}
        </div>

        <div class="form-section">
          <h3 class="section-title">Data Management</h3>
          <button class="btn-secondary" onclick="App.exportData()">Export All Data (JSON)</button>
          <button class="btn-secondary danger" onclick="App.confirmClearData()">Clear All Data</button>
        </div>

        <div class="form-section">
          <h3 class="section-title">About</h3>
          <div class="about-info">
            <p><strong>ContractorPro Estimator</strong></p>
            <p>Version 1.0.0</p>
            <p>Professional contractor estimates & invoices with ZIP-code adjusted regional pricing for all major trade types.</p>
            <p class="about-note">Pricing based on national averages adjusted by regional cost-of-living multipliers. Always verify local rates.</p>
          </div>
        </div>
      </div>
    `;
  },

  // =============================================
  // SUBSCRIBE VIEW
  // =============================================
  viewSubscribe() {
    return `
      <div class="view-subscribe">
        <div class="sub-hero">
          <div class="sub-logo">🏗️</div>
          <h2>ContractorPro</h2>
          <p class="sub-tagline">Professional estimates & invoices<br>for every trade</p>
        </div>

        <div class="pricing-card">
          <div class="price-amount">$5.99<span>/month</span></div>
          <div class="price-label">Everything you need to win more jobs</div>
        </div>

        <div class="features-list">
          <div class="feature-item">✅ Unlimited estimates & invoices</div>
          <div class="feature-item">✅ 12 contractor trade types</div>
          <div class="feature-item">✅ ZIP code regional pricing</div>
          <div class="feature-item">✅ Convert estimates to invoices</div>
          <div class="feature-item">✅ Print / Save to PDF</div>
          <div class="feature-item">✅ Company branding</div>
          <div class="feature-item">✅ Overhead & profit markup</div>
          <div class="feature-item">✅ Works on iOS & Android</div>
          <div class="feature-item">✅ No internet required (offline)</div>
        </div>

        <button class="btn-subscribe" onclick="App.handleSubscribe()">
          Subscribe for $5.99/month
        </button>
        
        ${this.trialDaysLeft > 0 ? `
          <button class="btn-trial" onclick="App.navigate('dashboard')">
            Continue Free Trial (${this.trialDaysLeft} days left)
          </button>
        ` : ''}

        <p class="sub-disclaimer">Cancel anytime. Pricing integrates with Stripe. Configure your Stripe payment link in the GitHub deployment settings.</p>

        <div class="demo-activate">
          <p>Developer / Demo Mode:</p>
          <button class="btn-link" onclick="App.activateDemoSub()">Activate Demo Subscription</button>
        </div>
      </div>
    `;
  },

  // =============================================
  // ITEM PICKER MODAL
  // =============================================
  showItemPicker() {
    const modal = document.getElementById('item-picker-modal');
    const content = document.getElementById('modal-sheet-content');
    if (!modal || !content) return;
    
    content.innerHTML = `
      <div class="modal-handle"></div>
      <h3 class="modal-title">Add Line Item</h3>
      <div class="modal-tabs">
        <button class="modal-tab active" onclick="App.showAllTradesInModal()">Browse Trades</button>
        <button class="modal-tab" onclick="App.showCustomInModal()">Custom Item</button>
      </div>
      <div id="modal-body">
        ${this.buildTradePickerContent()}
      </div>
    `;
    modal.classList.remove('hidden');
  },

  buildTradePickerContent() {
    return `
      <div class="trade-picker-grid">
        ${Object.entries(TRADES).map(([key, trade]) => `
          <button class="trade-picker-item" onclick="App.showTradeCategories('${key}')">
            <span class="tpi-icon">${trade.icon}</span>
            <span class="tpi-label">${trade.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  },

  showTradeCategories(tradeKey) {
    const trade = TRADES[tradeKey];
    const modalBody = document.getElementById('modal-body');
    if (!modalBody || !trade) return;

    modalBody.innerHTML = `
      <button class="modal-back" onclick="document.getElementById('modal-body').innerHTML = App.buildTradePickerContent()">
        ← Back to Trades
      </button>
      <h4 class="modal-sub-title">${trade.icon} ${trade.label}</h4>
      ${trade.categories.map((cat, ci) => `
        <div class="picker-category">
          <div class="picker-cat-name">${cat.name}</div>
          ${cat.items.map(item => {
            const est = this.currentEstimate;
            const mult = getMultiplier(est?.projectZip || '');
            const adjPrice = item.basePrice * mult;
            return `
              <div class="picker-item" onclick="App.addPickerItem('${tradeKey}', '${item.id}'); App.closeModal()">
                <div class="pi-left">
                  <div class="pi-name">${item.name}</div>
                  <div class="pi-unit">${UNIT_LABELS[item.unit] || item.unit}</div>
                </div>
                <div class="pi-right">
                  <div class="pi-price">${this.formatCurrency(adjPrice)}</div>
                  <div class="pi-per">per ${UNIT_LABELS[item.unit] || item.unit}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `).join('')}
    `;
  },

  showCategoryItems(tradeKey, catIdx) {
    this.showItemPicker();
    setTimeout(() => this.showTradeCategories(tradeKey), 10);
  },

  showAllTradesInModal() {
    const modalBody = document.getElementById('modal-body');
    if (modalBody) modalBody.innerHTML = this.buildTradePickerContent();
  },

  showCustomInModal() {
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;
    modalBody.innerHTML = `
      <div class="custom-item-form">
        <input class="form-input" id="ci-name" placeholder="Item name *">
        <div class="form-row-split">
          <input class="form-input" id="ci-qty" type="number" placeholder="Qty" value="1" min="0" step="0.01">
          <select class="form-input" id="ci-unit">
            ${Object.entries(UNIT_LABELS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
          </select>
        </div>
        <div class="form-row-split">
          <div class="li-price-wrap">
            <span>$</span>
            <input class="form-input" id="ci-price" type="number" placeholder="Unit price" min="0" step="0.01">
          </div>
          <div class="form-group">
            <label class="form-label">Labor %</label>
            <input class="form-input" id="ci-labor" type="number" value="60" min="0" max="100">
          </div>
        </div>
        <textarea class="form-input form-textarea" id="ci-notes" placeholder="Notes (optional)"></textarea>
        <button class="btn-primary" onclick="App.addCustomItemFromModal()">Add Item</button>
      </div>
    `;
  },

  addCustomItemFromModal() {
    const name = document.getElementById('ci-name')?.value;
    if (!name) { alert('Please enter an item name'); return; }
    const item = {
      id: 'custom_' + Date.now(),
      name,
      qty: parseFloat(document.getElementById('ci-qty')?.value || 1),
      unit: document.getElementById('ci-unit')?.value || 'ls',
      unitPrice: parseFloat(document.getElementById('ci-price')?.value || 0),
      laborPct: parseFloat(document.getElementById('ci-labor')?.value || 60) / 100,
      notes: document.getElementById('ci-notes')?.value || '',
      tradeLabel: 'Custom',
    };
    if (!this.currentEstimate) this.currentEstimate = this.blankEstimate();
    this.currentEstimate.lineItems = this.currentEstimate.lineItems || [];
    this.currentEstimate.lineItems.push(item);
    this.closeModal();
    this.recalculate();
    this.render();
  },

  addPickerItem(tradeKey, itemId) {
    const trade = TRADES[tradeKey];
    if (!trade) return;
    let foundItem = null;
    for (const cat of trade.categories) {
      foundItem = cat.items.find(i => i.id === itemId);
      if (foundItem) break;
    }
    if (!foundItem) return;

    if (!this.currentEstimate) this.currentEstimate = this.blankEstimate();
    this.currentEstimate.lineItems = this.currentEstimate.lineItems || [];
    
    this.currentEstimate.lineItems.push({
      id: foundItem.id + '_' + Date.now(),
      name: foundItem.name,
      qty: 1,
      unit: foundItem.unit,
      unitPrice: foundItem.basePrice,
      laborPct: foundItem.laborPct,
      tradeLabel: trade.label,
    });
    this.recalculate();
    this.render();
  },

  addCustomItem() {
    if (!this.currentEstimate) this.currentEstimate = this.blankEstimate();
    this.currentEstimate.lineItems = this.currentEstimate.lineItems || [];
    this.currentEstimate.lineItems.push({
      id: 'custom_' + Date.now(),
      name: 'Custom Item',
      qty: 1,
      unit: 'ls',
      unitPrice: 0,
      laborPct: 0.6,
      tradeLabel: 'Custom',
    });
    this.render();
  },

  closeModal() {
    const modal = document.getElementById('item-picker-modal');
    if (modal) modal.classList.add('hidden');
  },

  // =============================================
  // DATA OPERATIONS
  // =============================================
  blankEstimate() {
    return {
      id: 'est_' + Date.now(),
      date: Date.now(),
      status: 'draft',
      lineItems: [],
      overhead: DEFAULT_OVERHEAD,
      profit: DEFAULT_PROFIT,
      taxRate: DEFAULT_TAX_RATE,
      depositPct: 30,
      terms: this.defaultTerms(),
    };
  },

  defaultTerms() {
    return `Payment Terms: ${this.currentEstimate?.depositPct ?? 30}% deposit required to begin work. Remaining balance due upon project completion. Checks payable to ${this.companyInfo.name || '[Company Name]'}. This estimate is valid for 30 days from the date issued. Prices subject to change based on material costs at time of order. Any changes to project scope must be agreed upon in writing. All work guaranteed for 1 year unless otherwise noted.`;
  },

  updateEstField(field, value) {
    if (!this.currentEstimate) this.currentEstimate = this.blankEstimate();
    this.currentEstimate[field] = value;
  },

  updateLineItem(idx, field, value) {
    if (!this.currentEstimate?.lineItems) return;
    this.currentEstimate.lineItems[idx][field] = value;
  },

  removeLineItem(idx) {
    if (!this.currentEstimate?.lineItems) return;
    this.currentEstimate.lineItems.splice(idx, 1);
    this.render();
  },

  recalculate() {
    const totalsSection = document.getElementById('totals-section');
    if (totalsSection && this.currentEstimate) {
      totalsSection.innerHTML = this.buildTotalsHTML(this.currentEstimate);
    }
    // Update line item subtotals
    document.querySelectorAll('.line-item-row').forEach((row, idx) => {
      const item = this.currentEstimate?.lineItems?.[idx];
      if (item) {
        const subtotalEl = row.querySelector('.li-subtotal span');
        if (subtotalEl) subtotalEl.textContent = this.formatCurrency((item.qty || 0) * (item.unitPrice || 0));
      }
    });
  },

  onZipChange(zip) {
    if (zip.length === 5) {
      this.recalculate();
      const zipInfo = document.querySelector('.zip-info');
      if (zipInfo) {
        zipInfo.innerHTML = `📍 Regional multiplier: <strong>${(getMultiplier(zip) * 100).toFixed(0)}%</strong> of national average`;
      } else {
        this.render();
      }
    }
  },

  saveEstimate() {
    const est = this.currentEstimate;
    if (!est) return;
    if (!est.clientName || !est.projectName) {
      alert('Please fill in Client Name and Project Name.');
      return;
    }
    const calcs = this.calculateTotals(est);
    est.total = calcs.total;
    est.lastModified = Date.now();
    
    const existingIdx = this.estimates.findIndex(e => e.id === est.id);
    if (existingIdx >= 0) {
      this.estimates[existingIdx] = est;
    } else {
      this.estimates.push(est);
    }
    this.saveData();
    alert('✅ Estimate saved!');
    this.navigate('estimate_detail');
  },

  editEstimate(id) {
    const est = this.estimates.find(e => e.id === id);
    if (est) {
      this.currentEstimate = JSON.parse(JSON.stringify(est));
      this.navigate('new_estimate');
    }
  },

  openEstimate(id) {
    const est = this.estimates.find(e => e.id === id);
    if (est) {
      this.currentEstimate = est;
      this.navigate('estimate_detail');
    }
  },

  openInvoice(id) {
    const inv = this.invoices.find(i => i.id === id);
    if (inv) {
      this.currentInvoice = inv;
      this.navigate('invoice_detail');
    }
  },

  duplicateEstimate(id) {
    const est = this.estimates.find(e => e.id === id);
    if (est) {
      const dup = JSON.parse(JSON.stringify(est));
      dup.id = 'est_' + Date.now();
      dup.date = Date.now();
      dup.status = 'draft';
      dup.projectName = dup.projectName + ' (Copy)';
      this.estimates.push(dup);
      this.saveData();
      this.render();
    }
  },

  deleteEstimate(id) {
    if (confirm('Delete this estimate? This cannot be undone.')) {
      this.estimates = this.estimates.filter(e => e.id !== id);
      this.saveData();
      this.render();
    }
  },

  deleteInvoice(id) {
    if (confirm('Delete this invoice? This cannot be undone.')) {
      this.invoices = this.invoices.filter(i => i.id !== id);
      this.saveData();
      this.render();
    }
  },

  convertToInvoice() {
    if (this.currentEstimate) {
      this.convertEstimateToInvoice(this.currentEstimate.id || '');
    }
  },

  convertEstimateToInvoice(id) {
    const est = id ? this.estimates.find(e => e.id === id) : this.currentEstimate;
    if (!est) { alert('Please save the estimate first.'); return; }

    const calcs = this.calculateTotals(est);
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 30);

    const invoice = {
      id: 'inv_' + Date.now(),
      number: this.invoices.length + 1001,
      date: Date.now(),
      dueDate: dueDate.toISOString().split('T')[0],
      estimateId: est.id,
      clientName: est.clientName,
      clientEmail: est.clientEmail,
      clientPhone: est.clientPhone,
      projectName: est.projectName,
      projectAddress: est.projectAddress,
      projectCity: est.projectCity,
      projectZip: est.projectZip,
      lineItems: est.lineItems,
      ...calcs,
      status: 'unpaid',
      terms: est.terms,
      paymentInfo: this.companyInfo.paymentInfo,
    };

    this.invoices.push(invoice);
    this.saveData();

    est.status = 'approved';
    const estIdx = this.estimates.findIndex(e => e.id === est.id);
    if (estIdx >= 0) this.estimates[estIdx] = est;
    this.saveData();

    alert('✅ Invoice created!');
    this.currentInvoice = invoice;
    this.navigate('invoice_detail');
  },

  markInvoicePaid(id) {
    const inv = this.invoices.find(i => i.id === id);
    if (inv) {
      inv.status = 'paid';
      inv.paidDate = new Date().toISOString().split('T')[0];
      this.saveData();
      if (this.currentView === 'invoices') this.render();
      else alert('✅ Invoice marked as paid!');
    }
  },

  previewEstimate() {
    this.saveEstimate();
    this.navigate('estimate_detail');
  },

  printDoc(type) {
    window.print();
  },

  printInvoice(id) {
    this.openInvoice(id);
    setTimeout(() => window.print(), 300);
  },

  // =============================================
  // SETTINGS & SUBSCRIPTION
  // =============================================
  updateCompany(field, value) {
    this.companyInfo[field] = value;
  },

  saveCompanyInfo() {
    this.saveData();
    alert('✅ Company info saved!');
  },

  handleSubscribe() {
    // In production: redirect to Stripe payment link
    // Replace this URL with your actual Stripe payment link
    const stripeUrl = 'https://buy.stripe.com/your_payment_link_here';
    if (confirm('You will be redirected to our secure payment page ($5.99/month). Continue?')) {
      window.open(stripeUrl, '_blank');
      // After payment: Stripe webhook would activate subscription
      // For now show demo activation
      setTimeout(() => {
        if (confirm('Payment complete? Activate subscription?')) {
          this.activateDemoSub();
        }
      }, 2000);
    }
  },

  activateDemoSub() {
    this.subscription = {
      active: true,
      plan: 'monthly',
      price: 5.99,
      startDate: Date.now(),
      renewDate: Date.now() + 30 * 86400000,
    };
    this.saveData();
    alert('✅ Subscription activated!');
    this.navigate('dashboard');
  },

  exportData() {
    const data = {
      estimates: this.estimates,
      invoices: this.invoices,
      company: this.companyInfo,
      exported: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contractorpro-data.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  confirmClearData() {
    if (confirm('Clear ALL data? This will delete all estimates and invoices and cannot be undone.')) {
      localStorage.clear();
      location.reload();
    }
  },

  filterEstimates(query) {
    const container = document.getElementById('estimates-list-container');
    if (!container) return;
    const filtered = this.estimates.filter(e =>
      (e.projectName || '').toLowerCase().includes(query.toLowerCase()) ||
      (e.clientName || '').toLowerCase().includes(query.toLowerCase())
    ).sort((a, b) => b.date - a.date);
    container.innerHTML = filtered.length === 0 ? '<div class="empty-state"><p>No estimates match your search</p></div>' :
      filtered.map(est => this.buildEstimateCard(est, true)).join('');
  },

  filterEstimatesByStatus(status) {
    const container = document.getElementById('estimates-list-container');
    if (!container) return;
    const filtered = (status ? this.estimates.filter(e => e.status === status) : this.estimates)
      .sort((a, b) => b.date - a.date);
    container.innerHTML = filtered.length === 0 ? '<div class="empty-state"><p>No estimates found</p></div>' :
      filtered.map(est => this.buildEstimateCard(est, true)).join('');
  },

  filterInvoicesByStatus(status) {
    const container = document.getElementById('invoices-list-container');
    if (!container) return;
    const filtered = (status ? this.invoices.filter(i => i.status === status) : this.invoices)
      .sort((a, b) => b.date - a.date);
    container.innerHTML = filtered.length === 0 ? '<div class="empty-state"><p>No invoices found</p></div>' :
      filtered.map(inv => this.buildInvoiceCard(inv)).join('');
  },

  startEstimateWithTrade(tradeKey) {
    this.currentEstimate = this.blankEstimate();
    this.currentEstimate.tradeType = tradeKey;
    this.navigate('new_estimate');
  },

  // =============================================
  // NAVIGATION
  // =============================================
  navigate(view) {
    this.prevView = this.currentView;
    if (view === 'new_estimate' && this.currentView !== 'new_estimate') {
      if (this.currentView !== 'new_estimate') {
        this.currentEstimate = this.blankEstimate();
      }
    }
    this.currentView = view;
    this.render();
    window.scrollTo(0, 0);
  },

  goBack() {
    const backMap = {
      new_estimate: 'dashboard',
      estimates: 'dashboard',
      invoices: 'dashboard',
      settings: 'dashboard',
      subscribe: 'dashboard',
      estimate_detail: 'estimates',
      invoice_detail: 'invoices',
    };
    this.navigate(backMap[this.currentView] || 'dashboard');
  },

  // =============================================
  // UTILS
  // =============================================
  formatCurrency(n) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0);
  },

  formatDate(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  attachEventListeners() {
    // Prevent modal close when clicking inside sheet
    const sheet = document.getElementById('modal-sheet-content');
    if (sheet) {
      sheet.addEventListener('click', e => e.stopPropagation());
    }
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
