import {Box, Text, Center, Stack} from '@mantine/core';
import {IconDatabaseOff} from '@tabler/icons-react';

type NoDataPlaceholderProps = {
  message?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

export default function NoDataPlaceholder({
                                            message = 'No data available',
                                            icon,
                                            children,
                                          }: NoDataPlaceholderProps) {
  return (
    <Center className="w-full h-full p-6 rounded-lg border-gray-300">
      <Stack align="center">
        <Box className="text-gray-400 text-5xl">
          {icon ?? <IconDatabaseOff size={48}/>}
        </Box>
        <Text className="text-gray-500 text-base font-medium text-center">
          {message}
        </Text>
        {children}
      </Stack>
    </Center>
  );
}