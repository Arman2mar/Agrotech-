// Estado de la aplicación
const state = {
    profile: 'ramon',
    currentSection: 'dashboard',
    finca: null,
    unitType: 'vara',
    data: {
        ramon: {
            nombre: "Finca El Roble",
            superficie: { valor: 40, unidad: 'cordeles' },
            cultivos: [
                { nombre: "Frijol", area: 15, etapa: "Floración", estado: "warning", riesgo: "Sequía" },
                { nombre: "Maíz", area: 20, etapa: "Vegatativo", estado: "success", riesgo: "Ninguno" }
            ],
            animales: [
                { tipo: "Bueyes", cantidad: 2, estado: "success", funcion: "Trabajo" },
                { tipo: "Gallinas", cantidad: 12, estado: "success", funcion: "Huevos" }
            ],
            agua: { disponible: 60, demanda: 80, estado: "warning" },
            economia: { ingresos: 1200, gastos: 800, margen: 400 },
            suelo: { ph: 5.8, mo: 2.5, n: "Bajo", p: "Medio", k: "Alto" }
        },
        marta: {
            nombre: "AgroTech Solutions",
            superficie: { valor: 10, unidad: 'caballerías' },
            cultivos: [
                { nombre: "Tomate Orgánico", area: 3, etapa: "Cosecha", estado: "success", riesgo: "Mercado" },
                { nombre: "Pimiento", area: 4, etapa: "Floración", estado: "success", riesgo: "Plagas" },
                { nombre: "Lechuga", area: 2, etapa: "Siembra", estado: "neutral", riesgo: "Ninguno" }
            ],
            animales: [
                { tipo: "Bovinos", cantidad: 50, estado: "success", funcion: "Carne" },
                { tipo: "Abejas", cantidad: 20, estado: "success", funcion: "Polinización" }
            ],
            agua: { disponible: 95, demanda: 70, estado: "success" },
            economia: { ingresos: 45000, gastos: 28000, margen: 17000 },
            suelo: { ph: 6.5, mo: 4.2, n: "Alto", p: "Alto", k: "Medio" }
        }
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    setProfile('ramon');
    setupEventListeners();
    renderAll();
});

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-ES', options);
    
    // Simulación fase lunar
    const phases = ['🌑 Luna Nueva', '🌓 Cuarto Creciente', '🌕 Luna Llena', '🌗 Cuarto Menguante'];
    const randomPhase = phases[Math.floor(Math.random() * phases.length)];
    document.getElementById('moon-phase').textContent = randomPhase;
}

function setProfile(profile) {
    state.profile = profile;
    state.finca = state.data[profile] || state.data.ramon;
    
    // Actualizar UI
    document.querySelectorAll('.profile-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.profile === profile);
    });
    
    document.body.classList.remove('ramon-mode', 'marta-mode', 'futuro-mode');
    if (profile === 'ramon') document.body.classList.add('ramon-mode');
    
    renderAll();
}

function navigateTo(section) {
    state.currentSection = section;
    
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        const sections = ['dashboard', 'mapa', 'cultivos', 'animales', 'economia', 'decisiones', 'fotos', 'simulador'];
        item.classList.toggle('active', sections[index] === section);
    });
    
    // Scroll top
    document.querySelector('.main-content').scrollTop = 0;
}

function renderAll() {
    renderDashboard();
    renderMap();
    renderSoil();
    renderWater();
    renderCrops();
    renderLivestock();
    renderLOOPHH();
    renderEconomy();
    renderDecisions();
    renderScenarios();
    renderCalendar();
    renderQuests();
    renderMemory();
}

function renderDashboard() {
    const grid = document.getElementById('dashboard-grid');
    const f = state.finca;
    
    const cards = [
        { icon: '🌾', label: 'Superficie', value: `${f.superficie.valor} ${f.superficie.unidad}`, status: 'success' },
        { icon: '💧', label: 'Agua', value: `${f.agua.disponible}%`, status: f.agua.estado },
        { icon: '🐄', label: 'Animales', value: f.animales.reduce((a, b) => a + b.cantidad, 0), status: 'success' },
        { icon: '💰', label: 'Margen', value: `$${f.economia.margen}`, status: f.economia.margen > 0 ? 'success' : 'critical' },
        { icon: '🌱', label: 'Cultivos', value: f.cultivos.length, status: 'success' },
        { icon: '⚠️', label: 'Riesgos', value: f.cultivos.filter(c => c.estado === 'warning').length, status: f.cultivos.some(c => c.estado === 'warning') ? 'warning' : 'success' }
    ];
    
    grid.innerHTML = cards.map(card => `
        <div class="card ${card.status}" onclick="showDetails('${card.label}')">
            <div class="card-status ${card.status}"></div>
            <div class="card-icon">${card.icon}</div>
            <div class="card-value">${card.value}</div>
            <div class="card-label">${card.label}</div>
        </div>
    `).join('');
    
    // Actualizar semáforo principal
    const hasCritical = f.agua.estado === 'critical' || f.economia.margen < 0;
    const hasWarning = f.agua.estado === 'warning' || f.cultivos.some(c => c.estado === 'warning');
    
    document.querySelectorAll('.semaphore-light').forEach((light, idx) => {
        light.classList.remove('active');
        if (idx === 0 && !hasCritical && !hasWarning) light.classList.add('active');
        if (idx === 1 && hasWarning && !hasCritical) light.classList.add('active');
        if (idx === 2 && hasCritical) light.classList.add('active');
    });
}

function renderMap() {
    const map = document.getElementById('farm-map');
    const zones = [
        { type: 'crop', label: 'Cultivo 1', top: '10%', left: '10%', width: '35%', height: '40%' },
        { type: 'crop', label: 'Cultivo 2', top: '10%', left: '50%', width: '40%', height: '30%' },
        { type: 'livestock', label: 'Potrero', top: '55%', left: '10%', width: '40%', height: '35%' },
        { type: 'water', label: 'Reserva', top: '55%', left: '55%', width: '35%', height: '35%' }
    ];
    
    map.innerHTML = zones.map(zone => `
        <div class="map-zone zone-${zone.type}" style="top: ${zone.top}; left: ${zone.left}; width: ${zone.width}; height: ${zone.height};">
            ${zone.label}
        </div>
    `).join('');
}

function renderSoil() {
    const f = state.finca.suelo;
    const container = document.getElementById('soil-data');
    
    const indicators = [
        { label: 'pH', value: f.ph, unit: '', badge: f.ph >= 6 && f.ph <= 7 ? 'measured' : 'estimated' },
        { label: 'Materia Orgánica', value: f.mo, unit: '%', badge: 'estimated' },
        { label: 'Nitrógeno', value: f.n, unit: '', badge: 'inferred' },
        { label: 'Fósforo', value: f.p, unit: '', badge: 'inferred' },
        { label: 'Potasio', value: f.k, unit: '', badge: 'inferred' }
    ];
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            ${indicators.map(ind => `
                <div class="card">
                    <div class="card-label">${ind.label}</div>
                    <div class="card-value" style="font-size: 1.5rem;">${ind.value} ${ind.unit}</div>
                    <span class="badge badge-${ind.badge}">${ind.badge === 'measured' ? 'Medido' : ind.badge === 'estimated' ? 'Estimado' : 'Inferido'}</span>
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,107,0,0.1); border-radius: 12px; border-left: 4px solid var(--orange);">
            <strong style="color: var(--orange);">Recomendación:</strong> 
            ${f.ph < 6 ? 'Aplicar cal para corregir acidez.' : 'Mantener manejo actual. Considerar análisis de laboratorio para precisión.'}
        </div>
    `;
}

function renderWater() {
    const f = state.finca.agua;
    const container = document.getElementById('water-data');
    
    container.innerHTML = `
        <div class="card ${f.estado}">
            <div class="card-icon">💧</div>
            <div class="card-value">${f.disponible}%</div>
            <div class="card-label">Disponibilidad vs Demanda (${f.demanda}%)</div>
        </div>
        
        <div style="margin-top: 1rem;">
            <h3 style="color: var(--gold); margin-bottom: 1rem;">Balance Hídrico</h3>
            <div style="background: var(--charcoal); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Entradas (Lluvia + Riego)</span>
                    <span style="color: var(--agro-green);">+85%</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Salidas (Evapotranspiración)</span>
                    <span style="color: var(--alert-red);">-70%</span>
                </div>
                <div style="border-top: 1px solid var(--border); padding-top: 0.5rem; margin-top: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; font-weight: 700;">
                        <span>Reserva Neta</span>
                        <span style="color: ${f.disponible > f.demanda ? 'var(--agro-green)' : 'var(--alert-red)'}">
                            ${f.disponible - f.demanda > 0 ? '+' : ''}${f.disponible - f.demanda}%
                        </span>
                    </div>
                </div>
            </div>
            
            <h4 style="color: var(--gold); margin-bottom: 0.5rem;">Alternativas de Riego</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <button class="btn-secondary" onclick="showModal('riego')">
                    🚿 Goteo (Inversión: Alta | Ahorro: 40%)
                </button>
                <button class="btn-secondary" onclick="showModal('riego')">
                    🐄 Riego por gravedad (Inversión: Baja | Eficiencia: 50%)
                </button>
            </div>
        </div>
    `;
}

function renderCrops() {
    const list = document.getElementById('crops-list');
    list.innerHTML = state.finca.cultivos.map(crop => `
        <div class="card ${crop.estado}" style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h3 style="color: var(--gold); margin-bottom: 0.25rem;">${crop.nombre}</h3>
                    <p style="color: var(--text-dim); font-size: 0.9rem;">${crop.area} ${state.finca.superficie.unidad} • ${crop.etapa}</p>
                </div>
                <span class="badge badge-${crop.estado === 'warning' ? 'pending' : 'measured'}">${crop.riesgo}</span>
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button class="btn-secondary" style="flex: 1; font-size: 0.8rem;">Ver Detalles</button>
                <button class="btn-secondary" style="flex: 1; font-size: 0.8rem;">Registrar Labor</button>
            </div>
        </div>
    `).join('');
}

function renderLivestock() {
    const list = document.getElementById('livestock-list');
    list.innerHTML = state.finca.animales.map(animal => `
        <div class="card" style="margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 3rem;">
                    ${animal.tipo === 'Bueyes' ? '🐂' : animal.tipo === 'Gallinas' ? '🐔' : animal.tipo === 'Bovinos' ? '🐄' : '🐝'}
                </div>
                <div style="flex: 1;">
                    <h3 style="color: var(--gold);">${animal.tipo}</h3>
                    <p style="color: var(--text-dim);">${animal.cantidad} unidades • ${animal.funcion}</p>
                </div>
                <div class="card-status ${animal.estado}"></div>
            </div>
        </div>
    `).join('');
}

function renderLOOPHH() {
    const container = document.getElementById('loophh-list');
    const interactions = [
        { from: '🐂 Bueyes', action: 'transporta', to: '🌾 Cultivos', impact: 'positive', desc: 'Transporte de cosecha' },
        { from: '🐔 Gallinas', action: 'fertiliza', to: '🌱 Suelo', impact: 'positive', desc: 'Aporte de nitrógeno' },
        { from: '🐝 Abejas', action: 'poliniza', to: '🌻 Cultivos', impact: 'positive', desc: 'Aumento de rendimiento' },
        { from: '💧 Agua', action: 'limita', to: '🌾 Producción', impact: 'negative', desc: 'Déficit hídrico detectado' }
    ];
    
    container.innerHTML = interactions.map(int => `
        <div class="loophh-node">
            <div class="loophh-icon">${int.from.split(' ')[0]}</div>
            <div class="loophh-content">
                <h4>${int.from}</h4>
                <p>${int.action} → ${int.to}</p>
                <p style="font-size: 0.8rem; color: var(--text-dim);">${int.desc}</p>
            </div>
            <div style="font-size: 1.5rem; color: ${int.impact === 'positive' ? 'var(--agro-green)' : 'var(--alert-red)'}">
                ${int.impact === 'positive' ? '↑' : '↓'}
            </div>
        </div>
    `).join('');
}

function renderEconomy() {
    const f = state.finca.economia;
    const container = document.getElementById('economy-dashboard');
    
    const items = [
        { label: 'Ingresos', value: `$${f.ingresos}`, class: 'positive' },
        { label: 'Gastos', value: `$${f.gastos}`, class: 'negative' },
        { label: 'Margen', value: `$${f.margen}`, class: f.margen > 0 ? 'positive' : 'negative' },
        { label: 'ROI', value: `${((f.margen/f.gastos)*100).toFixed(1)}%`, class: 'positive' }
    ];
    
    container.innerHTML = items.map(item => `
        <div class="economy-item">
            <div class="economy-label">${item.label}</div>
            <div class="economy-value ${item.class}">${item.value}</div>
        </div>
    `).join('');
}

function renderDecisions() {
    const container = document.getElementById('decision-matrix');
    const decisions = [
        { 
            title: 'Vender fresco vs Procesar', 
            options: [
                { name: 'Vender fresco', income: 1200, time: '1 día', risk: 'Bajo' },
                { name: 'Procesar (mermelada)', income: 2400, time: '3 días', risk: 'Medio' }
            ]
        }
    ];
    
    container.innerHTML = decisions.map(dec => `
        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--gold); margin-bottom: 1rem;">${dec.title}</h3>
            ${dec.options.map(opt => `
                <div class="decision-option" onclick="selectDecision(this)">
                    <div class="decision-title">${opt.name}</div>
                    <div class="decision-stats">
                        <span>💰 $${opt.income}</span>
                        <span>⏱️ ${opt.time}</span>
                        <span>⚠️ ${opt.risk}</span>
                    </div>
                </div>
            `).join('')}
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(57,255,20,0.1); border-radius: 12px; border: 1px solid var(--agro-green);">
                <strong style="color: var(--agro-green);">TÚ DECIDES:</strong> 
                La tecnología muestra datos, pero el conocimiento del productor elige el camino.
            </div>
        </div>
    `).join('');
}

function renderScenarios() {
    const container = document.getElementById('scenarios-list');
    const scenarios = [
        { title: '¿Y si compro una bomba de agua?', impact: '+30% disponibilidad', cost: '$500', roi: '6 meses' },
        { title: '¿Y si contrato 2 trabajadores?', impact: '+50% velocidad cosecha', cost: '$200/mes', roi: 'Inmediato' },
        { title: '¿Y si instalo riego por goteo?', impact: '-40% uso de agua', cost: '$1200', roi: '12 meses' }
    ];
    
    container.innerHTML = scenarios.map(scen => `
        <div class="scenario-card" onclick="showScenarioDetail('${scen.title}')">
            <div class="scenario-title">🔮 ${scen.title}</div>
            <div class="scenario-impact">
                <span class="impact-positive">↑ ${scen.impact}</span>
                <span class="impact-neutral">💵 ${scen.cost}</span>
                <span class="impact-positive">⏱️ ${scen.roi}</span>
            </div>
        </div>
    `).join('');
}

function renderCalendar() {
    const container = document.getElementById('calendar-content');
    const today = new Date();
    const month = today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    container.innerHTML = `
        <div style="background: var(--charcoal); border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem;">
            <h3 style="color: var(--gold); text-transform: uppercase; margin-bottom: 1rem;">${month}</h3>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; text-align: center; font-size: 0.8rem; margin-bottom: 1rem;">
                <div style="color: var(--text-dim);">L</div>
                <div style="color: var(--text-dim);">M</div>
                <div style="color: var(--text-dim);">X</div>
                <div style="color: var(--text-dim);">J</div>
                <div style="color: var(--text-dim);">V</div>
                <div style="color: var(--text-dim);">S</div>
                <div style="color: var(--text-dim);">D</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; text-align: center;">
                ${Array.from({length: 30}, (_, i) => `
                    <div style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 8px; ${i === today.getDate()-1 ? 'background: var(--orange); color: black; font-weight: 800;' : 'background: var(--card-bg);'}">
                        ${i + 1}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="padding: 1rem; background: rgba(139,92,246,0.1); border-radius: 12px; border-left: 4px solid var(--tech-purple);">
            <strong style="color: var(--tech-purple);">Próximas labores:</strong>
            <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: var(--text-dim);">
                <li>Aplicar fertilizante nitrogenado (día 5)</li>
                <li>Revisar sistema de riego (día 10)</li>
                <li>Cosecha de frijol estimada (día 25)</li>
            </ul>
        </div>
    `;
}

function renderQuests() {
    if (state.profile !== 'futuro') {
        document.getElementById('quests-list').innerHTML = '<p style="color: var(--text-dim);">Cambia al modo "Futuro Finquero" para ver los retos educativos.</p>';
        return;
    }
    
    const container = document.getElementById('quests-list');
    const quests = [
        { title: 'Conversor de Unidades', points: 100, desc: 'Convierte 30 varas a metros sin usar la app', completed: true },
        { title: 'Identificación de Suelo', points: 150, desc: 'Toma una foto del suelo y predice su textura', completed: false },
        { title: 'Cálculo de Margen', points: 200, desc: 'Calcula la ganancia de vender 100 libras de frijol', completed: false }
    ];
    
    container.innerHTML = quests.map(quest => `
        <div class="quest-card" style="${quest.completed ? 'opacity: 0.6;' : ''}">
            <span class="quest-points">+${quest.points} XP</span>
            <h3 style="color: var(--gold); margin: 0.5rem 0;">${quest.title}</h3>
            <p style="color: var(--text-dim); font-size: 0.9rem;">${quest.desc}</p>
            ${quest.completed ? '<span style="color: var(--agro-green); font-weight: 700;">✓ Completad
