import mongoose from 'mongoose';
import { expect } from 'chai';
import User from '../models/User.js';
import config from '../config/index.js';

describe('User Model Test', () => {
    before(async () => {
        await mongoose.connect(config.database.url, config.database.options);
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should create & save user successfully', async () => {
        const validUser = new User({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            phone: '0123456789'
        });
        const savedUser = await validUser.save();
        
        expect(savedUser._id).to.exist;
        expect(savedUser.email).to.equal('test@example.com');
        expect(savedUser.name).to.equal('Test User');
        expect(savedUser.phone).to.equal('0123456789');
        expect(savedUser.role).to.equal('user');
        expect(savedUser.password).to.not.equal('password123');
    });

    it('should fail to save user without required fields', async () => {
        const userWithoutRequiredField = new User({
            email: 'test@example.com'
        });
        
        try {
            await userWithoutRequiredField.save();
            expect.fail('Should throw validation error');
        } catch (error) {
            expect(error).to.exist;
            expect(error.name).to.equal('ValidationError');
        }
    });

    it('should fail to save user with invalid email', async () => {
        const userWithInvalidEmail = new User({
            email: 'invalid-email',
            password: 'password123',
            name: 'Test User',
            phone: '0123456789'
        });
        
        try {
            await userWithInvalidEmail.save();
            expect.fail('Should throw validation error');
        } catch (error) {
            expect(error).to.exist;
            expect(error.name).to.equal('ValidationError');
        }
    });

    it('should fail to save duplicate email', async () => {
        const user1 = new User({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User 1',
            phone: '0123456789'
        });
        
        const user2 = new User({
            email: 'test@example.com',
            password: 'password456',
            name: 'Test User 2',
            phone: '9876543210'
        });

        await user1.save();
        
        try {
            await user2.save();
            expect.fail('Should throw duplicate key error');
        } catch (error) {
            expect(error).to.exist;
            expect(error.code).to.equal(11000);
        }
    });

    it('should correctly compare password', async () => {
        const user = new User({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            phone: '0123456789'
        });
        await user.save();

        const validPassword = await user.comparePassword('password123');
        const invalidPassword = await user.comparePassword('wrongpassword');

        expect(validPassword).to.be.true;
        expect(invalidPassword).to.be.false;
    });

    it('should generate valid JWT token', () => {
        const user = new User({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            phone: '0123456789'
        });

        const token = user.generateAuthToken();
        expect(token).to.be.a('string');
    });

    it('should handle login attempts correctly', async () => {
        const user = new User({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            phone: '0123456789'
        });
        await user.save();

        // Should be able to login initially
        expect(user.canLogin()).to.be.true;

        // Increment login attempts
        await user.incrementLoginAttempts();
        await user.incrementLoginAttempts();
        await user.incrementLoginAttempts();
        await user.incrementLoginAttempts();
        await user.incrementLoginAttempts();

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.loginAttempts).to.equal(5);
        expect(updatedUser.lockUntil).to.exist;
        expect(updatedUser.canLogin()).to.be.false;
    });
});