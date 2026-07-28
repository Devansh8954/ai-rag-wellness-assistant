import { Request, Response, NextFunction } from 'express';
import { safetyGuardrails } from '../../src/middleware/safetyGuardrails';

describe('Safety Guardrails Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() for safe queries', () => {
    mockRequest.body = { prompt: 'How do I reduce stress before an interview?' };
    safetyGuardrails(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should intercept crisis keywords and return immediate intervention response', () => {
    mockRequest.body = { prompt: 'I want to end my life and need help' };
    safetyGuardrails(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        isCrisisIntervention: true,
        response: expect.stringContaining('988'),
      })
    );
  });
});
