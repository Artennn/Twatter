import { Box, Button, Stack, IconButton, SvgIcon, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { AuthLayout } from "./Layouts";
import { signIn } from "next-auth/react";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf, z } from "zod";
import { ControlledTextField } from "../Inputs";
import { useRouter } from "next/router";

export const LoginValidation = z.object({
    email: z.string().email("Niepoprawny adres email").endsWith("@pollub.edu.pl", "Niedozwolona domena"),
    password: z.string().min(5, "Haslo jest zbyt krotkie"),
    password2: z.string().min(5, "Haslo jest zbyt krotkie"),
})
    .refine(({ password, password2 }) => password === password2, {
        message: "Hasła są różne",
        path: ["password2"]
    })

export type LoginMethod = TypeOf<typeof LoginValidation>

export const NewLoginMethod = ({ handleCreate } : { handleCreate: (data: LoginMethod) => void }) => {
    const router = useRouter();

    const formMethodes = useForm<LoginMethod>({
        resolver: zodResolver(LoginValidation),
        mode: "onTouched"
    })

    const { handleSubmit, formState: { isValid, isDirty } } = formMethodes;

    const onSubmit: SubmitHandler<LoginMethod> = (data) => {
        handleCreate(data);
    };

    return (
        <AuthLayout>
            <IconButton sx={{ position: 'absolute', top: 8, left: 8 }} onClick={() => router.push("/login")}>
                <CloseIcon fontSize="large" />
            </IconButton>

            <SvgIcon sx={{ width: '100%', height: '2.5rem' }}>
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </SvgIcon>

            <Typography variant="h4" mt={4} mb={4}>
                Wybierz metodę logowania
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <FormProvider {...formMethodes}>
                    <Stack direction="column" height="100%" spacing={3} pl={10} pr={10}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ borderRadius: 4 }}
                            onClick={() => signIn("google")}
                        >
                            <SvgIcon version="1.1" viewBox="0 0 48 48" sx={{ height: 18, width: 18, mr: 1 }}>
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path>
                            </SvgIcon>
                            Zaloguj się przez Google
                        </Button>

                        <ControlledTextField
                            label="Adres email"
                            name="email"
                        />
                        <ControlledTextField
                            label="Hasło"
                            name="password"
                            type="password"
                        />
                        <ControlledTextField
                            label="Powtórz Hasło"
                            name="password2"
                            type="password"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            disabled={!isDirty || !isValid}
                            sx={{ borderRadius: 4 }}
                        >
                            Dalej
                        </Button>
                    </Stack>
                </FormProvider>
            </Box>
        </AuthLayout>
    )
}