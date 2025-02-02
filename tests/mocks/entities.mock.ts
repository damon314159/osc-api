export const mockUser = {
  id: 1,
  username: "testuser",
  password: "$a-password-hash",
  role: "USER" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCourse = {
  id: 1,
  title: "Test Course",
  description: "A test course",
  duration: 5,
  outcome: "A firm understanding of testing things",
  collectionId: 1,
};

export const mockCollection = {
  id: 1,
  name: "Test Collection",
  description: "A test collection",
};
