/**
 * ====================================================================
 * '고양속에 취하다' 랜딩페이지 메인 JavaScript 로직 (App.js)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.FESTIVAL_DATA;
  if (!data) {
    console.error("FESTIVAL_DATA를 찾을 수 없습니다.");
    return;
  }

  // 1. DOM 요소 바인딩 및 기본 데이터 입력
  initHeaderAndNav(data);
  initHeroSection(data);
  initStorySection(data);
  initLiquorSection(data);
  initProgramSection(data);
  initLocationSection(data);
  initFaqSection(data);
  initCountdownTimer(data.eventDateISO);
  init3dTicketEffect();
  initModals();
});

/* --- 1. 네비게이션 & 스크롤 효과 --- */
function initHeaderAndNav(data) {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --- 2. 히어로 섹션 데이터 바인딩 --- */
function initHeroSection(data) {
  document.getElementById('heroTitle').innerHTML = `'고양속'에 <em>취하다</em>`;
  document.getElementById('heroSubtitle').innerText = data.subTitle;
  document.getElementById('heroDateText').innerText = `${data.dateDisplay} (${data.timeDisplay})`;
  document.getElementById('heroLocationText').innerText = `${data.locationName} (${data.roadAddress})`;
}

/* --- 3. D-Day 카운트다운 타이머 --- */
function initCountdownTimer(targetISO) {
  const targetDate = new Date(targetISO).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('timerDays').innerText = '00';
      document.getElementById('timerHours').innerText = '00';
      document.getElementById('timerMinutes').innerText = '00';
      document.getElementById('timerSeconds').innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('timerDays').innerText = String(days).padStart(2, '0');
    document.getElementById('timerHours').innerText = String(hours).padStart(2, '0');
    document.getElementById('timerMinutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('timerSeconds').innerText = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --- 4. 3D 초대권 마우스 호버 이펙트 --- */
function init3dTicketEffect() {
  const ticketCard = document.querySelector('.ticket-card-3d');
  if (!ticketCard) return;

  ticketCard.addEventListener('mousemove', (e) => {
    const rect = ticketCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    ticketCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  ticketCard.addEventListener('mouseleave', () => {
    ticketCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

/* --- 5. 축제 브랜드 스토리 --- */
function initStorySection(data) {
  document.getElementById('storySlogan').innerText = `"${data.story.slogan}"`;
  document.getElementById('storyDesc').innerText = data.story.description;

  const highlightsGrid = document.getElementById('highlightsGrid');
  if (highlightsGrid) {
    highlightsGrid.innerHTML = data.story.highlights.map(h => `
      <div class="highlight-item">
        <div class="highlight-icon">${h.icon}</div>
        <div class="highlight-title">${h.title}</div>
        <div class="highlight-desc">${h.desc}</div>
      </div>
    `).join('');
  }
}

/* --- 6. 3개 지역 대표 주류 & 페어링 탭 인터랙션 --- */
function initLiquorSection(data) {
  const tabsContainer = document.getElementById('regionTabs');
  const displayCard = document.getElementById('liquorDisplayCard');
  if (!tabsContainer || !displayCard) return;

  // 탭 생성
  tabsContainer.innerHTML = data.regions.map((region, idx) => `
    <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-region-id="${region.id}">
      <span>${region.name}</span>
    </button>
  `).join('');

  // 첫번째 지역 표시
  renderLiquorDetails(data.regions[0]);

  // 탭 클릭 이벤트
  tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const regionId = btn.getAttribute('data-region-id');
      tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetRegion = data.regions.find(r => r.id === regionId);
      if (targetRegion) {
        renderLiquorDetails(targetRegion);
      }
    });
  });
}

function renderLiquorDetails(region) {
  const displayCard = document.getElementById('liquorDisplayCard');
  const fp = region.flavorProfile;

  displayCard.innerHTML = `
    <div class="liquor-img-wrapper">
      <img src="${region.image}" alt="${region.title}" />
      <div class="liquor-badge-abv">ABV ${region.abv}</div>
    </div>
    <div class="liquor-info-content">
      <div class="liquor-region-tag">${region.name} | ${region.drinkType}</div>
      <h3 class="liquor-title">${region.title}</h3>
      <div class="liquor-tagline">"${region.tagline}"</div>
      <p class="liquor-story">${region.story}</p>
      
      <!-- 맛 프로필 (Flavor Bar) -->
      <div class="flavor-profile-box">
        <div class="flavor-profile-title">
          <i class="fas fa-chart-bar"></i> ${region.title} 풍미 프로필
        </div>
        <div class="flavor-bars">
          <div class="flavor-item">
            <div class="flavor-label-row"><span>단맛 (Sweetness)</span><span>${fp.sweetness}%</span></div>
            <div class="flavor-bar-track"><div class="flavor-bar-fill" style="width: ${fp.sweetness}%"></div></div>
          </div>
          <div class="flavor-item">
            <div class="flavor-label-row"><span>산미/청량감 (Sour/Fresh)</span><span>${fp.sourness}%</span></div>
            <div class="flavor-bar-track"><div class="flavor-bar-fill" style="width: ${fp.sourness}%"></div></div>
          </div>
          <div class="flavor-item">
            <div class="flavor-label-row"><span>바디감 (Body)</span><span>${fp.body}%</span></div>
            <div class="flavor-bar-track"><div class="flavor-bar-fill" style="width: ${fp.body}%"></div></div>
          </div>
          <div class="flavor-item">
            <div class="flavor-label-row"><span>향/아로마 (Aroma)</span><span>${fp.aroma}%</span></div>
            <div class="flavor-bar-track"><div class="flavor-bar-fill" style="width: ${fp.aroma}%"></div></div>
          </div>
        </div>
      </div>

      <!-- 추천 안주 페어링 -->
      <div class="pairing-food-card">
        <img class="food-img-thumb" src="${region.recommendedFood.image}" alt="${region.recommendedFood.name}" />
        <div class="food-text-box">
          <h5>🍴 추천 페어링: ${region.recommendedFood.name}</h5>
          <p>${region.recommendedFood.desc}</p>
        </div>
      </div>
    </div>
  `;
}

/* --- 7. 프로그램 안내 섹션 --- */
function initProgramSection(data) {
  const timeline = document.getElementById('programTimeline');
  if (!timeline) return;

  timeline.innerHTML = data.programs.map(p => `
    <div class="program-card">
      <div>
        <span class="program-time-badge">${p.time}</span>
        <div class="program-icon-art">${p.icon}</div>
        <h4 class="program-title">${p.title}</h4>
        <p class="program-desc">${p.desc}</p>
      </div>
      <div style="margin-top:1rem;">
        <span style="font-size:0.75rem; background:rgba(229,184,105,0.15); color:#e5b869; padding:0.25rem 0.6rem; border-radius:4px; font-weight:700;">${p.badge}</span>
      </div>
    </div>
  `).join('');
}

/* --- 8. 오시는 길 섹션 --- */
function initLocationSection(data) {
  document.getElementById('locationBuilding').innerText = data.buildingName;
  document.getElementById('locationRoadAddress').innerText = data.roadAddress;
  document.getElementById('locationLandAddress').innerText = `(지번: ${data.landAddress})`;

  document.getElementById('btnKakaoMap').href = data.kakaoMapUrl;
  document.getElementById('btnNaverMap').href = data.naverMapUrl;

  const trafficList = document.getElementById('trafficList');
  if (trafficList) {
    trafficList.innerHTML = `
      <div class="traffic-item">
        <div class="traffic-icon"><i class="fas fa-bus"></i></div>
        <div class="traffic-info">
          <h6>셔틀 버스 안내</h6>
          <p>${data.traffic.shuttle}</p>
        </div>
      </div>
      <div class="traffic-item">
        <div class="traffic-icon"><i class="fas fa-subway"></i></div>
        <div class="traffic-info">
          <h6>대중교통 안내</h6>
          <p>${data.traffic.bus}</p>
        </div>
      </div>
      <div class="traffic-item">
        <div class="traffic-icon"><i class="fas fa-parking"></i></div>
        <div class="traffic-info">
          <h6>주차장 안내</h6>
          <p>${data.traffic.parking}</p>
        </div>
      </div>
    `;
  }
}

/* --- 9. FAQ 아코디언 --- */
function initFaqSection(data) {
  const faqList = document.getElementById('faqList');
  if (!faqList) return;

  faqList.innerHTML = data.faqs.map((item, idx) => `
    <div class="faq-item ${idx === 0 ? 'open' : ''}">
      <div class="faq-question">
        <span>Q. ${item.q}</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="faq-answer">
        <p>${item.a}</p>
      </div>
    </div>
  `).join('');

  faqList.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      parent.classList.toggle('open');
    });
  });
}

/* --- 10. 모달 팝업 & 초대권 생성 / 취향 퀴즈 --- */
function initModals() {
  // 모달 닫기 공통
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        overlay.classList.remove('active');
      }
    });
  });

  // 10-A. 초대권 신청 모달 열기
  const openTicketBtns = document.querySelectorAll('.btn-open-ticket');
  const ticketModalOverlay = document.getElementById('ticketModalOverlay');

  openTicketBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      ticketModalOverlay.classList.add('active');
    });
  });

  // 초대권 폼 제출
  const ticketForm = document.getElementById('ticketGeneratorForm');
  if (ticketForm) {
    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.getElementById('inputUserName').value.trim();
      const userPhone = document.getElementById('inputUserPhone').value.trim();
      const guestCount = document.getElementById('inputGuestCount').value;

      if (!userName || !userPhone) {
        alert('성함과 연락처를 입력해 주세요!');
        return;
      }

      // 발급 완료 카드 뷰 생성
      const serialNo = 'N38-2026-' + Math.floor(1000 + Math.random() * 9000);
      renderGeneratedTicket(userName, userPhone, guestCount, serialNo);

      // 폭죽 이펙트 실행
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });
  }

  // 10-B. 술 취향 테스트 퀴즈 모달
  const openQuizBtns = document.querySelectorAll('.btn-open-quiz');
  const quizModalOverlay = document.getElementById('quizModalOverlay');

  openQuizBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      quizModalOverlay.classList.add('active');
      resetQuizForm();
    });
  });

  const quizSubmitBtn = document.getElementById('btnSubmitQuiz');
  if (quizSubmitBtn) {
    quizSubmitBtn.addEventListener('click', calculateQuizResult);
  }
}

// 실시간 초대권 카드 생성 렌더링
function renderGeneratedTicket(name, phone, guests, serialNo) {
  const modalCard = document.querySelector('#ticketModalOverlay .modal-card');
  const data = window.FESTIVAL_DATA;

  modalCard.innerHTML = `
    <button class="modal-close-btn"><i class="fas fa-times"></i></button>
    <div style="text-align:center; margin-bottom: 1.5rem;">
      <span style="background:var(--crimson-red); color:#fff; font-size:0.8rem; font-weight:700; padding:0.3rem 0.8rem; border-radius:20px;">
        🎉 모바일 초대권 발급 완료!
      </span>
      <h3 style="font-family:var(--font-title); font-size:1.8rem; color:var(--gold-primary); margin-top:0.6rem;">
        ${name} 님의 N38 초대권
      </h3>
      <p style="font-size:0.88rem; color:#cbd5e0;">행사장 입구에서 본 초대권을 보여주시면 무료 시음잔을 드립니다.</p>
    </div>

    <!-- 발급된 티켓 실물 카드 뷰 -->
    <div class="ticket-card-3d" style="cursor:default; transform:none; margin:0 auto 1.5rem auto;">
      <div class="ticket-main">
        <div class="ticket-header-line">
          <span class="ticket-organizer-text">N38 속초문화관광재단</span>
          <span class="ticket-badge-pill">모바일 초대권</span>
        </div>
        <div class="ticket-title-art">'고양속'에 취하다</div>
        <div class="ticket-sub-art">고성 · 양양 · 속초 주류문화축제</div>
        <div style="margin:0.8rem 0; font-size:0.85rem; color:#4a5568;">
          <div><strong>성함:</strong> ${name} 님 (동반 ${guests}명)</div>
          <div><strong>일시:</strong> 2026.11.20 (금) 14:00~20:00</div>
          <div><strong>장소:</strong> ${data.locationName} (${data.roadAddress})</div>
        </div>
      </div>
      <div class="ticket-stub">
        <div class="stub-title">초대권</div>
        <div class="barcode-mock"></div>
        <div class="stub-no">${serialNo}</div>
      </div>
    </div>

    <div style="display:flex; gap:1rem; margin-top:1.5rem;">
      <button class="btn-primary" style="flex:1; justify-content:center;" onclick="window.print()">
        <i class="fas fa-print"></i> 초대권 저장 / 인쇄하기
      </button>
      <button class="btn-outline" style="flex:1; justify-content:center;" onclick="document.getElementById('ticketModalOverlay').classList.remove('active')">
        확인 완료
      </button>
    </div>
  `;

  // 모달 닫기 재바인딩
  modalCard.querySelector('.modal-close-btn').addEventListener('click', () => {
    document.getElementById('ticketModalOverlay').classList.remove('active');
  });
}

/* --- 11. 취향 퀴즈 로직 --- */
function resetQuizForm() {
  const quizContent = document.getElementById('quizFormContent');
  quizContent.innerHTML = `
    <h3 style="font-family:var(--font-title); font-size:1.8rem; color:var(--gold-primary); margin-bottom:1rem; text-align:center;">
      🍶 나만의 '고양속' 주류 취향 테스트
    </h3>
    <p style="color:#cbd5e0; font-size:0.95rem; text-align:center; margin-bottom:2rem;">
      3가지 간단한 질문을 통해 당신에게 가장 어울리는 지역 술과 특산물 안주 조합을 찾아보세요!
    </p>

    <div class="form-group" style="margin-bottom:1.5rem;">
      <label class="form-label">Q1. 오늘 밤 어떤 분위기에서 술 한잔 기울이고 싶나요?</label>
      <select id="quizQ1" class="form-input">
        <option value="goseong">아늑하고 따스한 구수한 전통 주막 감성</option>
        <option value="sokcho">시원한 동해 바닷바람과 청량하고 활기찬 분위기</option>
        <option value="yangyang">깊은 산속 고요함과 은은하고 고급스러운 잔향</option>
      </select>
    </div>

    <div class="form-group" style="margin-bottom:1.5rem;">
      <label class="form-label">Q2. 가장 선호하는 알코올 도수 스타일은?</label>
      <select id="quizQ2" class="form-input">
        <option value="goseong">부드럽고 달콤한 6% 도수</option>
        <option value="sokcho">톡 쏘는 청량감이 살아있는 5.2% 맥주</option>
        <option value="yangyang">묵직하고 묵은 풍미의 25% 증류주</option>
      </select>
    </div>

    <div class="form-group" style="margin-bottom:2rem;">
      <label class="form-label">Q3. 가장 당기는 지역 특산물 안주는?</label>
      <select id="quizQ3" class="form-input">
        <option value="goseong">야들야들 데친 동해 피문어 & 가리비 숙회</option>
        <option value="sokcho">고소하고 바싹하게 튀겨낸 속초 아바이 오징어순대</option>
        <option value="yangyang">은은한 송이 향이 맴도는 양양 자연산 송이버섯 구이</option>
      </select>
    </div>

    <button id="btnSubmitQuiz" class="btn-primary" style="width:100%; justify-content:center;">
      <i class="fas fa-magic"></i> 내 결과 확인하기
    </button>
  `;

  document.getElementById('btnSubmitQuiz').addEventListener('click', calculateQuizResult);
}

function calculateQuizResult() {
  const q1 = document.getElementById('quizQ1').value;
  const q2 = document.getElementById('quizQ2').value;
  const q3 = document.getElementById('quizQ3').value;

  const counts = { goseong: 0, sokcho: 0, yangyang: 0 };
  counts[q1]++;
  counts[q2]++;
  counts[q3]++;

  let winner = 'goseong';
  if (counts.sokcho > counts.goseong && counts.sokcho >= counts.yangyang) winner = 'sokcho';
  if (counts.yangyang > counts.goseong && counts.yangyang > counts.sokcho) winner = 'yangyang';

  const data = window.FESTIVAL_DATA;
  const matchRegion = data.regions.find(r => r.id === winner);

  const quizContent = document.getElementById('quizFormContent');
  quizContent.innerHTML = `
    <div style="text-align:center;">
      <span style="color:var(--gold-primary); font-weight:700; font-size:0.9rem;">✨ 맞춤 추천 결과</span>
      <h3 style="font-family:var(--font-title); font-size:2rem; color:var(--text-white); margin:0.5rem 0;">
        당신을 위한 술: <span style="color:var(--gold-primary);">${matchRegion.title}</span>
      </h3>
      <p style="color:var(--ocean-cyan); font-weight:600; font-size:1.05rem; margin-bottom:1.5rem;">
        "${matchRegion.tagline}"
      </p>

      <img src="${matchRegion.image}" alt="${matchRegion.title}" style="width:200px; height:200px; object-fit:cover; border-radius:16px; border:2px solid var(--border-gold); margin-bottom:1.5rem;" />

      <div style="background:rgba(9,17,30,0.8); padding:1.2rem; border-radius:12px; border:1px solid rgba(255,255,255,0.1); margin-bottom:1.8rem; text-align:left;">
        <h5 style="color:var(--gold-primary); margin-bottom:0.4rem;">🍴 찰떡 궁합 안주</h5>
        <p style="font-size:0.92rem; color:#e2e8f0;">${matchRegion.recommendedFood.name}</p>
      </div>

      <div style="display:flex; gap:1rem;">
        <button class="btn-primary btn-open-ticket" style="flex:1; justify-content:center;" onclick="document.getElementById('quizModalOverlay').classList.remove('active'); document.getElementById('ticketModalOverlay').classList.add('active');">
          🎟️ 이 추천 조합으로 초대권 발급
        </button>
        <button class="btn-outline" style="flex:1; justify-content:center;" onclick="resetQuizForm()">
          다시 테스트
        </button>
      </div>
    </div>
  `;
}
