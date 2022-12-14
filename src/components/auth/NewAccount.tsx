import { Box, Button, Stack, IconButton, Paper, SvgIcon, Typography, Checkbox } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { AuthLayout } from "./Layouts";

import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf, z } from "zod";
import { ControlledTextField } from "../Inputs";

export const AccountValidation = z.object({
    name: z.string().min(3, "Zbyt krótkie"),
    username: z.string().min(3, "Zbyt krótka"),
    image: z.string().url("Podaj link do zdjęcia"),
    accepted: z.literal(true)
})

export type Account = TypeOf<typeof AccountValidation>

export const NewAccount = ({ handleCreate } : { handleCreate: (data: Account) => void }) => {
    const formMethodes = useForm<Account>({
        resolver: zodResolver(AccountValidation),
        mode: "onTouched"
    })

    const { control, handleSubmit, formState: { isValid, isDirty } } = formMethodes;

    const onSubmit: SubmitHandler<Account> = (data) => {
        handleCreate(data);
    };

    return (
        <AuthLayout>
            <IconButton sx={{ position: 'absolute', top: 8, left: 8 }}>
                <CloseIcon fontSize="large" />
            </IconButton>

            <SvgIcon sx={{ width: '100%', height: '2.5rem' }}>
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </SvgIcon>

            <Typography variant="h4" mt={4} mb={4}>
                Utwórz konto
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <FormProvider {...formMethodes}>
                    <Stack direction="column" height="100%" spacing={3} pl={10} pr={10}>
                        <ControlledTextField
                            label="Imię"
                            name="name"
                        />
                        <ControlledTextField
                            label="Nazwa użytkownika"
                            name="username"
                        />
                        <ControlledTextField
                            label="Zdjęcie"
                            name="image"
                        />

                        <Stack direction="row">
                            <Controller 
                                name="accepted"
                                control={control}
                                render={({ field }) => <Checkbox {...field} />}
                            />
                            <Typography variant="subtitle2" mt="auto" mb="auto">
                                Akceptuję regulamin korzystania z serwisu.
                            </Typography>
                        </Stack>

                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            disabled={!isDirty || !isValid}
                            sx={{ borderRadius: 4 }}
                        >
                            Stwórz konto
                        </Button>
                    </Stack>
                </FormProvider>
            </Box>
        </AuthLayout>
    )
}