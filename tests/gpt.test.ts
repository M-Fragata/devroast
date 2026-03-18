import { generateRoast } from '@/lib/gpt';

// Mock the GoogleGenerativeAI for testing
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: jest.fn().mockResolvedValue(`
                {
                  "score": 8,
                  "verdict": "solid_work",
                  "roast": "This code is decent but could use some improvements.",
                  "issues": [
                    {
                      "title": "Missing error handling",
                      "description": "Consider adding try/catch blocks",
                      "status": "warning"
                    }
                  ],
                  "diff": [
                    {
                      "type": "add",
                      "content": "try {"
                    }
                  ]
                }
              `)
            }
          })
        })
      };
    })
  };
});

describe('generateRoast', () => {
  beforeEach(() => {
    // Reset environment variable before each test
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // Clean up after each test
    delete process.env.GEMINI_API_KEY;
    jest.clearAllMocks();
  });

  it('should generate a roast successfully', async () => {
    const code = 'console.log("Hello World");';
    const language = 'javascript';
    const mood = 'roast' as const;

    const result = await generateRoast(code, language, mood);

    expect(result).toBeDefined();
    expect(result.score).toBe(8);
    expect(result.verdict).toBe('solid_work');
    expect(result.roast).toContain('decent');
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].title).toBe('Missing error handling');
    expect(result.diff).toHaveLength(1);
  });

  it('should throw an error when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;

    await expect(
      generateRoast('console.log("test");', 'javascript', 'roast')
    ).rejects.toThrow('GEMINI_API_KEY environment variable is not set or is empty');
  });

  it('should handle invalid JSON response', async () => {
    // Mock invalid response
    const mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        text: jest.fn().mockResolvedValue('Invalid JSON response')
      }
    });

    // Re-mock the module with invalid response
    jest.mock('@google/generative-ai', () => {
      return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => {
          return {
            getGenerativeModel: jest.fn().mockReturnValue({
              generateContent: mockGenerateContent
            })
          };
        })
      };
    });

    await expect(
      generateRoast('console.log("test");', 'javascript', 'roast')
    ).rejects.toThrow('Invalid response from Gemini: no JSON found');
  });
});