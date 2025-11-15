// Define tiers
const TIERS = {
  1: { amount: 10000, rate: 0.05, label: 'Tier 1' },
  2: { amount: 20000, rate: 0.10, label: 'Tier 2' },
  3: { amount: 30000, rate: 0.20, label: 'Tier 3' }
};

// Member list
let members = [];

// Get DOM elements
const studentName = document.getElementById('studentName');
const tierSelect = document.getElementById('tierSelect');
const amountInput = document.getElementById('amountInput');
const registrationForm = document.getElementById('registrationForm');
const message = document.getElementById('message');
const membersTableBody = document.querySelector('#membersTable tbody');
const totalSavedSpan = document.getElementById('totalSaved');
const simulateWeekBtn = document.getElementById('simulateWeekBtn');

// Update amount input when tier changes
function updateAmountInput() {
  amountInput.value = TIERS[tierSelect.value].amount;
}
tierSelect.addEventListener('change', updateAmountInput);
updateAmountInput();

// Render members table
function renderMembers() {
  membersTableBody.innerHTML = '';
  let total = 0;
  members.forEach((m, idx) => {
    const totalForMember = m.baseAmount + m.accumulated;
    total += totalForMember;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${m.name}</td>
      <td>${TIERS[m.tier].label}</td>
      <td>₦${m.baseAmount.toLocaleString()}</td>
      <td>₦${m.accumulated.toLocaleString()}</td>
      <td>₦${totalForMember.toLocaleString()}</td>
      <td><button onclick="withdrawMember(${idx})">Withdraw</button></td>
    `;
    membersTableBody.appendChild(row);
  });
  totalSavedSpan.textContent = `₦${total.toLocaleString()}`;
}

// Withdraw member
function withdrawMember(idx) {
  if (confirm(`${members[idx].name} will withdraw ₦${(members[idx].baseAmount + members[idx].accumulated).toLocaleString()}. Proceed?`)) {
    members.splice(idx, 1);
    renderMembers();
  }
}

// Registration form submit
registrationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  message.textContent = '';
  const name = studentName.value.trim();
  const tier = Number(tierSelect.value);
  const amount = Number(amountInput.value);

  if (!name) { message.textContent = 'Enter a name.'; return; }
  if (amount !== TIERS[tier].amount) { message.textContent = `Invalid amount for ${TIERS[tier].label}.`; return; }
  if (members.length >= 12) { message.textContent = 'Maximum of 12 members reached.'; return; }

  members.push({ name, tier, baseAmount: amount, accumulated: 0 });
  studentName.value = '';
  renderMembers();
});

// Simulate weekly interest
simulateWeekBtn.addEventListener('click', () => {
  members.forEach(m => {
    m.accumulated += m.baseAmount * TIERS[m.tier].rate;
  });
  renderMembers();
});
