import { HttpException } from '@nestjs/common';

export const sqlOperationHandler = async <T>(
  operation: () => Promise<T>,
  title: string,
): Promise<T> => {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    throw new HttpException(
      {
        message: error.message,
        title,
      },
      500,
    );
  }
};
