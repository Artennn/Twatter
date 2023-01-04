import { TextField, type TextFieldProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export const ControlledTextField = ({
    name,
    ...otherProps
} : {
    name: string,
} & TextFieldProps) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <Controller control={control} name={name} defaultValue="" render={({ field }) => (
            <TextField
                {...otherProps}
                {...field}
                error={!!errors[name]}
                helperText={errors[name] ? errors[name]?.message as string : ''}
            />
        )}
        />
    )
}