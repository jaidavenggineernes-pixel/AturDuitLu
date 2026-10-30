const test = require("node:test");
const assert = require("node:assert");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "test_secret_for_aturduitlu_fintech";

test("Authentication: Password hashing & verification with bcrypt", async () => {
  const rawPassword = "password123";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  assert.notStrictEqual(rawPassword, hashedPassword);

  const isMatch = await bcrypt.compare(rawPassword, hashedPassword);
  assert.strictEqual(isMatch, true);

  const isWrongMatch = await bcrypt.compare("wrongpassword", hashedPassword);
  assert.strictEqual(isWrongMatch, false);
});

test("Authentication: JWT token sign and verify", () => {
  const payload = {
    userId: "usr_123456",
    email: "demo@aturduitlu.com",
    name: "Alex Pratama",
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  assert.strictEqual(typeof token, "string");

  const decoded = jwt.verify(token, JWT_SECRET);
  assert.strictEqual(decoded.userId, payload.userId);
  assert.strictEqual(decoded.email, payload.email);
  assert.strictEqual(decoded.name, payload.name);
});
