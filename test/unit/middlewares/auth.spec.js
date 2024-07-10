const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../../../src/middlewares/auth");
const { User } = require("../../../src/models/user");

jest.mock("jsonwebtoken");
jest.mock("dotenv", () => ({
  config: () => ({ JWT_SECRET: "testsecret" }),
}));

describe("authenticateToken middleware", () => {
  const mockRequest = (token) => ({
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const mockResponse = () => {
    const res = {};
    res.sendStatus = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should pass with a valid token", async () => {
    const userPayload = { id: 1, email: "test@example.com" };
    const token = jwt.sign(userPayload, "testsecret");
    const req = mockRequest(token);
    const res = mockResponse();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, userPayload);
    });

    await authenticateToken(req, res, mockNext);

    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(req.user).toEqual(userPayload);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 if no token provided", async () => {
    const req = mockRequest(undefined);
    const res = mockResponse();

    await authenticateToken(req, res, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 for invalid token", async () => {
    const token = "invalidtoken";
    const req = mockRequest(token);
    const res = mockResponse();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"));
    });

    await authenticateToken(req, res, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
