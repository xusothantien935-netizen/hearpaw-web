// HearPaw demo interactions: navigation, My Pet dashboard, cart and chat.
(() => {
  const $ = (id) => document.getElementById(id);
  const pages = [...document.querySelectorAll('.page')];
  const navLinks = [...document.querySelectorAll('[data-page]')];

  function showPage(pageId, updateHash = true) {
    const target = document.getElementById(pageId);
    if (!target || !target.classList.contains('page')) return;
    pages.forEach(page => page.classList.toggle('active', page === target));
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === pageId));
    if (updateHash && location.hash !== `#${pageId}`) history.pushState(null, '', `#${pageId}`);
    $('mainNav')?.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateFromHash() {
    const id = (location.hash || '#home').slice(1);
    const section = document.getElementById(id);
    if (section?.classList.contains('page')) showPage(id, false);
    else if (id) {
      const parentPage = section?.closest('.page');
      if (parentPage) showPage(parentPage.id, false);
      else showPage('home', false);
    } else showPage('home', false);
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    const page = target.classList.contains('page') ? target : target.closest('.page');
    if (page) {
      event.preventDefault();
      showPage(page.id);
      if (target !== page) setTimeout(() => target.scrollIntoView({behavior:'smooth', block:'start'}), 100);
    }
  });
  navLinks.forEach(link => link.addEventListener('click', e => { e.preventDefault(); showPage(link.dataset.page); }));
  window.addEventListener('hashchange', navigateFromHash);
  window.addEventListener('popstate', navigateFromHash);
  $('menuToggle')?.addEventListener('click', () => $('mainNav')?.classList.toggle('open'));
  navigateFromHash();

  // Product catalogue: selecting a colour swaps the actual product preview image.
  const catalogue = {
    collar1:{name:'Vòng cổ thông minh - vải',price:1599000,kind:'collar',caption:'HEARPAW SMART COLLAR · FABRIC',description:'Vòng cổ thông minh chất liệu vải mềm, thiết kế tối giản và dễ phối màu.',colors:[['Xanh rêu','#687653','moss'],['Be kem','#F5F0E6','beige'],['Hồng pastel','#F3C3CD','pink'],['Tím lavender','#C7B5E2','lavender'],['Đen','#242421','black']]},
    collar2:{name:'Vòng cổ thông minh Gen2',price:1799000,kind:'collar',caption:'HEARPAW SMART COLLAR · GEN 2',description:'Thế hệ vòng cổ thông minh mới với kiểu dáng hiện đại và màu sắc nổi bật.',colors:[['Xanh rêu','#687653','moss'],['Be','#E8DCC7','beige'],['Cam','#E98548','orange']]},
    leash1:{name:'Dây dắt thú cưng - vải mềm',price:129000,kind:'leash',caption:'HEARPAW SOFT FABRIC LEASH',description:'Dây dắt vải mềm, dễ cầm nắm, phù hợp cho những buổi dạo chơi mỗi ngày.',colors:[['Xanh lá đậm','#42684A','green'],['Vàng bơ','#E8D77D','butter'],['Hồng','#F0AFC0','pink'],['Xanh da trời','#8EC7E7','sky']],length:true},
    leash2:{name:'Dây dắt thú cưng - da mềm',price:179000,kind:'leash',caption:'HEARPAW SOFT LEATHER LEASH',description:'Dây dắt da mềm với bề mặt mịn và chi tiết kim loại thanh lịch.',colors:[['Xanh lá đậm','#42684A','green'],['Vàng bơ','#E8D77D','butter'],['Đỏ','#B84443','red']],length:true},
    tag1:{name:'Thẻ tên thú cưng cá nhân hóa - Kiểu Xương',price:69000,kind:'bone',caption:'PERSONALIZED PET TAG · BONE',description:'Thẻ tên hình xương có thể cá nhân hóa tên bé, giúp nhận diện dễ dàng.',colors:[['Bạc','#C5CBD0','silver'],['Hồng','#E7A7B7','pink']]},
    tag2:{name:'Thẻ tên thú cưng cá nhân hóa - Kiểu Tròn',price:69000,kind:'round',caption:'PERSONALIZED PET TAG · ROUND',description:'Thẻ tên hình tròn nhỏ gọn, tinh tế và phù hợp với nhiều loại vòng cổ.',colors:[['Bạc','#C5CBD0','silver'],['Hồng','#E7A7B7','pink']]}
  };
  let activeProductId='collar1', activeColorIndex=0, selectedProductSize='M';
  const money = value => `${value.toLocaleString('vi-VN')}đ`;
  function renderCatalogue(id, keepColor=false){
    const p=catalogue[id]; if(!p)return; activeProductId=id;
    if(!keepColor)activeColorIndex=0; else activeColorIndex=Math.min(activeColorIndex,p.colors.length-1);
    document.querySelectorAll('[data-product]').forEach(b=>b.classList.toggle('selected',b.dataset.product===id));
    if($('productTitle'))$('productTitle').textContent=p.name;
    if($('productPrice'))$('productPrice').innerHTML=`${money(p.price)} <span>${p.price>=1000000?'Miễn phí vận chuyển':'Giá demo'}</span>`;
    if($('productDescription'))$('productDescription').textContent=p.description;
    if($('productStageCaption'))$('productStageCaption').textContent=p.caption;
    const swatches=$('productSwatches');
    if(swatches)swatches.innerHTML=p.colors.map((c,i)=>`<button type="button" class="swatch ${i===activeColorIndex?'selected':''}" data-color-index="${i}" style="--swatch:${c[1]}" aria-label="${c[0]}" title="${c[0]}"></button>`).join('');
    if($('selectedColorName'))$('selectedColorName').textContent=p.colors[activeColorIndex][0];
    const image=$('productPreviewImage');
    if(image){
      const colorKey=p.colors[activeColorIndex][2];
      image.alt=`${p.name} màu ${p.colors[activeColorIndex][0]}`;
      // Ưu tiên ảnh thật theo màu nếu đã được thêm; nếu chưa có thì dùng ảnh sản phẩm chính.
      const candidates=[`assets/${id}-${colorKey}.webp`,`assets/${id}-main.webp`,`assets/${id}-${colorKey}.svg`,'assets/hearpaw-product.jpg'];
      let candidateIndex=0;
      image.onerror=()=>{candidateIndex+=1;if(candidateIndex<candidates.length)image.src=candidates[candidateIndex];else image.onerror=null;};
      image.src=candidates[candidateIndex];
    }
    let extra='';
    if(p.kind==='collar')extra=`<label class="product-extra-label" for="productSize">Chọn kích cỡ vòng cổ</label><div class="size-options"><button type="button" class="size-option ${selectedProductSize==='S'?'selected':''}" data-size="S">S <small>25–35 cm</small></button><button type="button" class="size-option ${selectedProductSize==='M'?'selected':''}" data-size="M">M <small>35–48 cm</small></button><button type="button" class="size-option ${selectedProductSize==='L'?'selected':''}" data-size="L">L <small>48–65 cm</small></button></div>`;
    if(p.length)extra=`<label class="product-extra-label" for="leashLength">Độ dài dây dắt</label><select id="leashLength" class="product-extra-select"><option value="1m">1 m</option><option value="1.5m" selected>1,5 m</option><option value="2m">2 m</option></select>`;
    if(p.kind==='bone'||p.kind==='round')extra=`<label class="product-extra-label" for="tagText">Tên muốn khắc trên thẻ</label><input id="tagText" class="product-extra-select" maxlength="18" placeholder="Ví dụ: Milo" />`;
    if($('productOptionsExtra'))$('productOptionsExtra').innerHTML=extra;
    if($('addProduct'))$('addProduct').textContent=`Thêm vào giỏ · ${money(p.price)}`;
  }
  $('productSwatches')?.addEventListener('click',e=>{const btn=e.target.closest('[data-color-index]');if(!btn)return;activeColorIndex=Number(btn.dataset.colorIndex);renderCatalogue(activeProductId,true);});
  document.querySelectorAll('[data-product]').forEach(btn=>btn.addEventListener('click',()=>renderCatalogue(btn.dataset.product)));
  document.addEventListener('click',e=>{const btn=e.target.closest('.size-option[data-size]');if(!btn)return;selectedProductSize=btn.dataset.size;document.querySelectorAll('.size-option[data-size]').forEach(x=>x.classList.toggle('selected',x.dataset.size===selectedProductSize));});
  renderCatalogue('collar1');
  function bindSwatches(containerId, previewId, nameId) {
    const container = $(containerId); if (!container) return;
    container.querySelectorAll('.swatch').forEach(button => button.addEventListener('click', () => {
      container.querySelectorAll('.swatch').forEach(item => item.classList.toggle('selected', item === button));
      const color = button.dataset.color || '#687653';
      if ($(previewId)) $(previewId).style.setProperty('--collar-color', color);
      if (nameId && $(nameId)) $(nameId).textContent = button.dataset.name || 'Màu đã chọn';
    }));
  }
  bindSwatches('customSwatches', 'customCollar', null);
  $('petName')?.addEventListener('input', e => { if ($('customPreviewName')) $('customPreviewName').textContent = e.target.value.trim() ? `Vòng cổ của ${e.target.value.trim()}` : 'Vòng cổ của bé'; });

  // Demo cart
  let cart = [];
  function renderCart() {
    if ($('cartCount')) $('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    if ($('cartTotal')) $('cartTotal').textContent = money(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
    if (!$('cartItems')) return;
    $('cartItems').innerHTML = cart.length ? cart.map((item, index) => `<div class="cart-item"><div><b>${item.name}</b><small>${money(item.price)} · SL ${item.qty}</small></div><button type="button" data-remove-cart="${index}" aria-label="Xóa sản phẩm">×</button></div>`).join('') : '<p class="empty-cart">Giỏ hàng đang trống. Thêm một chiếc vòng cho bé nhé! 🐾</p>';
  }
  function addItem(item) {
    const existing = cart.find(row => row.name === item.name);
    if (existing) existing.qty += 1; else cart.push({...item, qty: 1});
    renderCart();
    $('checkoutMessage') && ($('checkoutMessage').textContent = 'Đã thêm sản phẩm vào giỏ hàng demo.');
    openCart();
  }
  function openCart() { $('cartModal')?.classList.add('open'); $('cartModal')?.setAttribute('aria-hidden', 'false'); }
  function closeCart() { $('cartModal')?.classList.remove('open'); $('cartModal')?.setAttribute('aria-hidden', 'true'); }
  $('addProduct')?.addEventListener('click', () => { const p=catalogue[activeProductId]; const color=p.colors[activeColorIndex][0]; let detail=`${p.name} · ${color}`; if(p.kind==='collar')detail+=` · size ${selectedProductSize} (${selectedProductSize==='S'?'25–35':selectedProductSize==='M'?'35–48':'48–65'} cm)`; if(p.length)detail+=` · dài ${$('leashLength')?.value||'1.5m'}`; if(p.kind==='bone'||p.kind==='round'){const tag=$('tagText')?.value.trim();if(tag)detail+=` · khắc tên ${tag}`;} addItem({name:detail,price:p.price}); });
  $('addCustom')?.addEventListener('click', () => {
    const pet = $('petName')?.value.trim();
    const color = $('customSwatches')?.querySelector('.swatch.selected')?.dataset.name || 'Xanh rêu';
    const size = $('customSize')?.value || 'M';
    addItem({name:`Vòng cổ cá nhân hóa${pet ? ` cho ${pet}` : ''} · ${color} · size ${size}`, price:1748000});
  });
  $('cartOpen')?.addEventListener('click', openCart);
  $('cartClose')?.addEventListener('click', closeCart);
  $('cartModal')?.addEventListener('click', e => { if (e.target === $('cartModal')) closeCart(); });
  $('cartItems')?.addEventListener('click', e => {
    const button = e.target.closest('[data-remove-cart]');
    if (button) { cart.splice(Number(button.dataset.removeCart), 1); renderCart(); }
  });
  $('checkoutButton')?.addEventListener('click', () => {
    const loggedIn = sessionStorage.getItem('hearpawDemoLoggedIn') === 'true';
    if (!cart.length) { $('checkoutMessage').textContent = 'Giỏ hàng đang trống. Bà hãy thêm sản phẩm trước nhé!'; return; }
    if (!loggedIn) {
      sessionStorage.setItem('hearpawReturnUrl', location.pathname + '#product');
      location.href = 'login.html';
      return;
    }
    $('checkoutMessage').textContent = 'Đặt hàng demo thành công! Đây chỉ là mô phỏng, chưa có thanh toán thật.';
  });
  renderCart();

  // Summary cards navigate to the matching My Pet tab.
  document.querySelectorAll('[data-goto]').forEach(button => button.addEventListener('click', () => {
    const tab = button.dataset.goto;
    const myPetPage = document.getElementById('mypet');
    if (myPetPage) showPage('mypet');
    const tabButton = document.querySelector(`.dash-link[data-tab="${tab}"]`);
    if (tabButton) tabButton.click();
  }));

  // My Pet dashboard tabs
  document.querySelectorAll('.dash-link[data-tab]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.dash-link').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('.dash-panel').forEach(panel => panel.classList.toggle('active', panel.id === `panel-${button.dataset.tab}`));
  }));
  $('saveProfile')?.addEventListener('click', () => {
    if ($('activePetName')) $('activePetName').textContent = $('profileName')?.value.trim() || 'Bé yêu';
    if ($('profileSaved')) $('profileSaved').textContent = 'Đã lưu hồ sơ demo trong giao diện.';
  });
  $('findPet')?.addEventListener('click', () => { if ($('mapToast')) $('mapToast').textContent = 'Đã làm mới vị trí mô phỏng của bé 🐾'; });
  $('zoneRadius')?.addEventListener('input', e => { if ($('radiusValue')) $('radiusValue').textContent = `${e.target.value} m`; if ($('zoneCircle')) $('zoneCircle').style.transform = `scale(${0.65 + Number(e.target.value) / 1000 * 0.5})`; });
  function updateZone() {
    const enabled = !!$('zoneToggle')?.checked;
    if ($('zoneStatus')) $('zoneStatus').textContent = enabled ? 'Đang bật' : 'Đã tắt';
    if ($('zoneCircle')) $('zoneCircle').style.opacity = enabled ? '1' : '.18';
  }
  $('zoneToggle')?.addEventListener('change', updateZone);
  $('testAlert')?.addEventListener('click', () => { if ($('zoneMessage')) $('zoneMessage').textContent = 'Cảnh báo demo đã được mô phỏng; không gửi thông báo thật.'; });
  $('resetZone')?.addEventListener('click', () => { if ($('zoneToggle')) $('zoneToggle').checked = true; if ($('zoneRadius')) $('zoneRadius').value = 300; if ($('radiusValue')) $('radiusValue').textContent = '300 m'; if ($('zoneMessage')) $('zoneMessage').textContent = 'Đã khôi phục cài đặt demo.'; updateZone(); });
  $('refreshDemo')?.addEventListener('click', () => {
    if ($('stepStat')) $('stepStat').textContent = '6.842';
    if ($('activeStat')) $('activeStat').innerHTML = '2,3 <em>giờ</em>';
    if ($('zoneToggle')) $('zoneToggle').checked = true;
    if ($('zoneRadius')) $('zoneRadius').value = 300;
    if ($('radiusValue')) $('radiusValue').textContent = '300 m';
    if ($('zoneMessage')) $('zoneMessage').textContent = '';
    if ($('mapToast')) $('mapToast').textContent = 'Demo đã được làm mới về dữ liệu mặc định.';
    updateZone();
    const refresh = $('refreshDemo');
    if (refresh) { const old = refresh.textContent; refresh.textContent = '✓ Đã làm mới'; setTimeout(() => refresh.textContent = old, 1800); }
  });
  $('resetDemo')?.addEventListener('click', () => { if ($('profileName')) $('profileName').value = 'Milo'; if ($('profileBreed')) $('profileBreed').value = 'Golden Retriever'; if ($('activePetName')) $('activePetName').textContent = 'Milo'; if ($('profileSaved')) $('profileSaved').textContent = 'Đã đặt lại dữ liệu mẫu.'; });
  $('markRead')?.addEventListener('click', () => { document.querySelectorAll('#alertsList .tag').forEach(tag => { tag.textContent = 'Đã xem'; tag.classList.remove('tag-red','tag-yellow'); }); const count = document.querySelector('.alert-count'); if (count) count.textContent = '0'; });
  $('activityPeriod')?.addEventListener('change', e => { if ($('activeStat')) $('activeStat').innerHTML = e.target.value === 'today' ? '1,2 <em>giờ</em>' : e.target.value === 'month' ? '2,5 <em>giờ</em>' : '2,3 <em>giờ</em>'; });

  // Demo contact form
  $('contactForm')?.addEventListener('submit', e => { e.preventDefault(); if ($('contactStatus')) $('contactStatus').textContent = 'Cảm ơn bạn! Lời nhắn đã được ghi nhận trên giao diện demo, chưa gửi lên máy chủ.'; e.target.reset(); });

  // Demo chat
  function addChatMessage(text, type) {
    const message = document.createElement('div'); message.className = type === 'user' ? 'user-message' : 'bot-message'; message.textContent = text; $('chatMessages')?.appendChild(message); if ($('chatMessages')) $('chatMessages').scrollTop = $('chatMessages').scrollHeight;
  }
  function replyTo(text) {
    const q = text.toLowerCase();
    if (q.includes('giá') || q.includes('sản phẩm') || q.includes('vòng')) return 'Vòng cổ GPS 4G HearPaw có giá demo 1.599.000đ. Bạn có thể chọn màu và thêm vào giỏ hàng để trải nghiệm.';
    if (q.includes('cá nhân')) return 'Bạn có thể chọn màu dây, nhập tên thú cưng và chọn kích cỡ tại mục Cá nhân hóa.';
    if (q.includes('pet') || q.includes('thú cưng') || q.includes('milo')) return 'Mục My Pet có hồ sơ thú cưng, vị trí, vùng an toàn, hoạt động và thông báo minh họa.';
    return 'Cảm ơn bạn đã nhắn HearPaw 🐾 Bạn có thể hỏi về giá sản phẩm, cá nhân hóa hoặc My Pet nhé.';
  }
  $('chatToggle')?.addEventListener('click', () => $('chatPanel')?.classList.toggle('open'));
  $('chatClose')?.addEventListener('click', () => $('chatPanel')?.classList.remove('open'));
  document.querySelectorAll('[data-chat]').forEach(button => button.addEventListener('click', () => { const text = button.dataset.chat; addChatMessage(text, 'user'); addChatMessage(replyTo(text), 'bot'); }));
  $('chatForm')?.addEventListener('submit', e => { e.preventDefault(); const input = $('chatInput'); const text = input?.value.trim(); if (!text) return; addChatMessage(text, 'user'); addChatMessage(replyTo(text), 'bot'); input.value = ''; });
})();
