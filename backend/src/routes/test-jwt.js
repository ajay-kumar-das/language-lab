import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || "test-secret";
const payload = { id: "test", userId: "test", email: "test@example.com" };
const options = { expiresIn: "7d" };
try {
    const token = jwt.sign(payload, secret, options);
    console.log("JWT test successful:", token);
}
catch (error) {
    console.error("JWT test failed:", error);
}
EOF < /dev/null;
