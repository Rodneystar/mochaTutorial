var authController= require('../controllers/auth.controller.js');
var assert = require('assert');
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised");
var sinon = require('sinon');
chai.use(chaiAsPromised);
var expect = chai.expect;
var should = chai.should();


describe('AuthController', function() {
  beforeEach('this function is setting up the roles', function settingUpRoles() {
    console.log('running before each');
    authController.setRoles(['user']);
  })
  describe('isAuthorized', function() {
    var user = {};
    beforeEach(function() {
      user = {
        roles: ['user'],
        isAuthorized: function(neededRole) {
          return this.roles.indexOf(neededRole) >= 0;
        }
      }
      sinon.spy(user, 'isAuthorized')
      authController.setUser(user);
    });
    it('Should return false if not authorized', function() {
      var isAuth = authController.isAuthorized('admin');
      user.isAuthorized.callCount.should.equal(1);
      // console.log(user.isAuthorized);
      expect(isAuth).to.be.false;
      isAuth.should.be.false;
    })
    it('Should return true if authorized', function() {
      var isAuth = authController.isAuthorized('user');
      expect(isAuth).to.be.true;
    })
    it('Should not allow a get if not authorized');
    it('Should allow a get if authorized');
  })
  describe('isAuthorizedAsync', function() {
    it('Should return false if not authorized', function(done) {
      authController.isAuthorizedAsync('admin',
      function(isAuth) {
        expect(isAuth).to.be.false;
        done();
      })
    })
  })
  describe('isAuthorizedPromise', function() {
    it('Should return false if not authorized', function() {
      return authController.isAuthorizedPromise('admin')
        .should.eventually.be.false;
    })
  })
  describe('getIndex',function() {
    beforeEach(function() {
      user = {
        roles: ['user'],
        isAuthorized: function(neededRole) {
          return this.roles.indexOf(neededRole) >= 0;
        }
      }
    });
    it('should render index if authorized', function() {
      var isAuth = sinon.stub(user, 'isAuthorized').throws('hiya');
      var req = {user: user}
      var res = {
        render: function() {}
      }
      var mock = sinon.mock(res);
      mock.expects('render').once().withExactArgs('error');

      authController.getIndex(req,res)
      isAuth.calledOnce.should.be.true;
      mock.verify();
    })
  })
})
