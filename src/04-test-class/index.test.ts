import {
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

const startBalance = 2000;
const BankAccount = getBankAccount(startBalance);

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(BankAccount.getBalance()).toBe(startBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => BankAccount.withdraw(startBalance + 500)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const anotherAccount = getBankAccount(2000);
    expect(() => BankAccount.transfer(3000, anotherAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => BankAccount.transfer(3000, BankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const BankAccount = getBankAccount(startBalance);
    BankAccount.deposit(3000);
    expect(BankAccount.getBalance()).toBe(startBalance + 3000);
  });

  test('should withdraw money', () => {
    const BankAccount = getBankAccount(startBalance);
    BankAccount.withdraw(800);
    expect(BankAccount.getBalance()).toBe(1200);
  });

  test('should transfer money', () => {
    const BankAccount = getBankAccount(startBalance);
    const anotherAccount = getBankAccount(2000);
    BankAccount.transfer(1000, anotherAccount);
    expect(BankAccount.getBalance()).toBe(1000);
    expect(anotherAccount.getBalance()).toBe(3000);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(BankAccount, 'fetchBalance').mockResolvedValue(100);
    expect(typeof (await BankAccount.fetchBalance())).toBe('number');
    jest.spyOn(BankAccount, 'fetchBalance').mockResolvedValue(null);
    expect(await BankAccount.fetchBalance()).toBeNull();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(BankAccount, 'fetchBalance').mockResolvedValue(1000);
    await BankAccount.synchronizeBalance();
    expect(BankAccount.getBalance()).toBe(1000);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(BankAccount, 'fetchBalance').mockResolvedValue(null);
    await expect(BankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
