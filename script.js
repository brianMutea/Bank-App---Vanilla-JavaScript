'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Brian Mutea',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Mutea Kaai',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'John Doe',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Serena Letoya',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const loginForm = document.querySelector('.login');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

document
  .getElementById('login-help')
  .addEventListener('click', e => e.preventDefault());

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const createUserName = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const htmlDisplay = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${move}</div>
    </div>   
    
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlDisplay);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((accum, mov) => accum + mov, 0);
  labelBalance.textContent = `${account.balance} KSH`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} KSH`;

  const out = Math.abs(
    account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${out} KSH`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}KSH`;
};
const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;
    loginForm.style.display = 'none';
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputClosePin.blur();

    updateUI(currentAccount);
  } else {
    alert('Pin Incorrect!');
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recepientAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    recepientAcc &&
    currentAccount.balance >= amount &&
    recepientAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recepientAcc.movements.push(amount);
    updateUI(currentAccount);
  } else if (!recepientAcc) {
    alert('account to does not exist');
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  const closeUsername = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);

  if (
    closeUsername === currentAccount.username &&
    closePin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  } else {
    console.log('err');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// const checkDogs = function (dogsJulia, dogsKate) {
//   const bothData = [...dogsJulia, ...dogsKate];

//   // bothData.forEach((dog, i) => {
//   //   console.log(
//   //     `Dog number: ${i + 1} is ${
//   //       dog >= 3 ? `an adult and is ${dog} years old.` : 'still a puppy 🐶'
//   //     }`
//   //   );
//   // });
//   for (const [i, dog] of bothData.entries()) {
//     console.log(
//       `Dog number: ${i + 1} is ${
//         dog >= 3 ? `an adult and is ${dog} years old.` : 'still a puppy 🐶'
//       }`
//     );
//   }
//   // const removeAgesJ = dogsJulia.slice(1, -2);
//   // console.log(removeAgesJ);
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// // const ages = [...dogsJulia, ...dogsKate];
// console.log('================================');
// const calcAverageHumanAge = function (ages) {
//   ages
//     .map((dogAge, i) => {
//       let humanAge;
//       console.log(
//         `${
//           dogAge <= 2
//             ? `Dog ${i + 1} equivalent human age is: ${(humanAge = 2 + dogAge)}`
//             : `Dog ${i + 1} equivalent human age is: ${(humanAge =
//                 16 + dogAge + 4)}`
//         }`
//       );
//     })
//     .filter(humanAge => humanAge < 18);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// const euroToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov * euroToUsd);
// console.log(movements);
// console.log(movementsUSD);

// const user = 'Brian Mutea Kaai';

//
// console.log(accounts);

// const deposit = movements.filter(mov => {
//   return mov > 0;
// });

// const withdrwals = movements.filter(mov => {
//   return mov < 0;
// });
// console.log(deposit, withdrwals);

// // const balance = movements.reduce((acc, curr, i, arr) => {
// //   console.log(acc);
// //   return acc + curr;
// // }, 0); //The initial value of the accumulator is set here.

// // console.log(balance);

// const convertTitleCase = function (title) {
//   const exceptions = [
//     'a',
//     'and',
//     'with',
//     'for',
//     'but',
//     'an',
//     'or',
//     'the',
//     'in',
//     'on',
//     'to',
//   ];
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   // First convert all the strings to lowercase
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };
// console.log(convertTitleCase('this is a long Example'));
// console.log(convertTitleCase('And an ELEPHANT can walk in the Mad'));
// console.log(convertTitleCase('but I am very pro in the work'));

const dog = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Brian', 'Mutea'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dog.forEach(dog => {
  dog.recommendedFood = Math.floor(dog.weight ** 0.75 * 28);
  console.log();
});
console.log(dog);

const dogSarah = dog.find(dog => dog.owners.includes('Brian'));
console.log(dogSarah);
console.log(
  `Brian's Dog is eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'Little'
  }`
);

const ownersEatTooMuch = dog
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);
const ownersEatTooLittle = dog
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooLittle);
