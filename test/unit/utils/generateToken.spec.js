const jwt = require("jsonwebtoken");
const { generateToken } = require("../../../src/utils/generateToken");
const { JWT_SECRET } = process.env;

jest.mock("jsonwebtoken");

describe("generateToken function", () => {
  const userId = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a valid JWT token", () => {
    const mockToken = "mockedtoken";
    jwt.sign.mockReturnValue(mockToken);

    const token = generateToken(userId);

    expect(token).toBe(mockToken);
    expect(jwt.sign).toHaveBeenCalledWith({ userId }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });
});
