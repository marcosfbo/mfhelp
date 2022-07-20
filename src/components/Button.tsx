import { Button as ButtonNativeBase, IButtonProps, Heading } from 'native-base';

type Props = IButtonProps & {
    title: string;
}

export function Button( { title, ...rest } : Props ) {
  return (
    <ButtonNativeBase 
        background="green.700"
        height={14}
        fontSize="sm"
        rounded="sm"
        _pressed={{ bg: "green.500"}}
        {...rest}
    >
        <Heading color="white" fontSize="sm">
            {title}
        </Heading>
    </ButtonNativeBase>
  );
}