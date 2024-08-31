const chai = require('chai')
const sinon = require('sinon')
const should = chai.should()

const helpers = require('../helpers/auth-helpers')
const { createModelMock, createControllerProxy, mockRequest, mockResponse, mockNext } = require('../helpers/unit-test-helper')

// 模擬 2 間餐廳資料
let mockRestaurantData = [
  {
    id: 1,
    name: 'Restaurant1',
    tel: 'tel',
    address: 'address',
    opening_hours: 'opening_hours',
    description: 'test description',
    FavoritedUsers: [
      {
        userId: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Restaurant2',
    tel: 'tel',
    address: 'address',
    opening_hours: 'opening_hours',
    description: 'description',
    categoryId: 1,
    FavoritedUsers: [],
  },
]

describe('# R04: Like / Unlike', function () {
  context('# Q1: 使用者可以 Like 餐廳', () => {
    before(() => {
      // 模擬登入驗證
      this.ensureAuthenticated = sinon
        .stub(helpers, 'ensureAuthenticated')
        .returns(true)
      this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })

      // 建立了一個模擬的 Restaurant table，裡面放入 2 間餐廳資料
      this.restaurantMock = createModelMock('Restaurant', mockRestaurantData)

      // 建立了一個模擬的 Like table，裡面目前是空的
      this.mockLikeData = []
      this.likeMock = createModelMock('Like', this.mockLikeData)
      
      // 連向模擬的 Like table
      this.userController = createControllerProxy('../controllers/user-controller', {
        Like: this.likeMock,
        Restaurant: this.restaurantMock
      })
    })

    it(' POST /like/:restaurantId ', async () => {
      // 模擬 request & response & next
      const req = mockRequest({ params: { restaurantId: 2 }, user: {id: 1} }) // 帶入 params.restaurantId = 2, user.id = 1，對 POST /like/2 發出請求
      const res = mockResponse()
      const next = mockNext

      // 測試 userController.addLike 函式
      await this.userController.addLike(req, res, next)
      // 將模擬的 Like table 內的資料全數撈出
      const likes = await this.likeMock.findAll()
      // addLike 執行完畢後，Like table 應會從空的 -> 變成有 1 筆資料
      likes.should.have.lengthOf(1)
      // 資料裡的 userId 應該會跟我們傳入的 user id 一樣
      likes[0].userId.should.equal(1)
      // 資料裡的 RestaurantId 會跟我們傳入的 params.restaurantId 一樣
      likes[0].restaurantId.should.equal(2)
    })

    it(' DELETE /like/:restaurantId ', async () => {
      // 模擬 request & response & next
      // 模擬發出 request, 帶入 params.id = 1, params.restaurantId = 2, user.id = 1
      const req = mockRequest({ params: { id: 1, restaurantId: 2 }, user: {id: 1} }) // 對 DELETE /like/2 發出請求
      const res = mockResponse()
      const next = mockNext

      // 測試作業指定的 userController.removeLike 函式
      await this.userController.removeLike(req, res, next)

      // 將模擬的 Like table 內的資料全數撈出
      const likes = await this.likeMock.findAll()
      // addLike 執行完畢後，Like table 應會從有 1 筆資料 -> 變成空的
      likes.should.have.lengthOf(0)
    })

    after(async () => {
      // 清除驗證資料
      this.ensureAuthenticated.restore()
      this.getUser.restore()
    })
  })
})