import { Box, Stack, Button, Dialog, IconButton, SvgIcon, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf, z } from "zod";
import { ControlledTextField } from "components/Inputs";
import { Profile } from "@prisma/client";
import { trpc } from "utils/trpc";

export const EditProfileValidation = z.object({
    displayName: z.string().min(3, "Zbyt krótka nazwa"),
    image: z.string().url("Podaj link do zdjęcia"),
    background: z.string().url("Podaj link do zdjęcia").optional()
        .or(z.literal(""))
})

type EditProfile = TypeOf<typeof EditProfileValidation>

export const EditProfileDialog = ({
    profile,
    onClose,
} : {
    profile: Profile,
    onClose: () => void,
}) => {
    const formMethodes = useForm<EditProfile>({
        resolver: zodResolver(EditProfileValidation),
        mode: "onTouched",
        defaultValues: {
            displayName: profile.displayName,
            image: profile.image,
            background: profile.background || undefined,
        }
    })

    const { handleSubmit, formState: { isValid, isDirty } } = formMethodes;

    const queryUtils = trpc.useContext();
    const { mutate: profileMutate } = trpc.profile.edit.useMutation();

    const onSubmit: SubmitHandler<EditProfile> = (data) => {
        profileMutate(data, {
            onSuccess: () => {
                queryUtils.profile.invalidate();
                onClose();
            }
        })
    };

    return (
        <Dialog open={true}>
            <Box 
                width={600} height={650} 
                bgcolor="black" 
                borderRadius={2} 
                p={2}
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormProvider {...formMethodes}>
                    <Stack 
                        position="relative"
                        direction="column" 
                        spacing={3}
                        pl={5} 
                        pr={5} 
                        textAlign="center" 
                        height="100%"
                    >
                        <IconButton sx={{ position: 'absolute', top: 8, left: 8 }} onClick={onClose} >
                            <CloseIcon fontSize="large" />
                        </IconButton>

                        <SvgIcon sx={{ width: '100%', height: '2.5rem' }}>
                            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                        </SvgIcon>

                        <Typography fontSize={31} mt={2} mb={2}>Customize your profile</Typography>

                        <ControlledTextField
                            label="Display Name"
                            name="displayName"
                        />
                        <ControlledTextField
                            label="Profile Picture"
                            name="image"
                        />
                        <ControlledTextField
                            label="Background Picture"
                            name="background"
                            
                        />

                        <Button 
                            type="submit"
                            variant="contained" 
                            color="secondary" 
                            disabled={!isDirty || !isValid}
                            sx={{ borderRadius: 4 }}
                        >
                            Zapisz
                        </Button>
                    </Stack>
                </FormProvider>
            </Box>
        </Dialog>
    )
}