import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const ContactSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }).min(2, { message: 'Name must be at least 2 characters!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: zod
    .string()
    .min(1, { message: 'Phone number is required!' })
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
      message: 'Please enter a valid phone number!',
    }),
  purpose: zod.string().min(1, { message: 'Purpose is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }).min(10, { message: 'Message must be at least 10 characters!' }),
});

// ----------------------------------------------------------------------

export function ContactForm() {
  const defaultValues = {
    name: '',
    email: '',
    phoneNumber: '',
    purpose: '',
    message: '',
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: zodResolver(ContactSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Form data:', data);
      // TODO: Implement form submission
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div>
      <Typography
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          fontSize: '1.2rem',
          fontWeight: '500',
          color: 'customBrown.main',
        }}
      >
        At Gudworld, we’re on a mission to help you make the switch from Sulphur laded sweeteners to our Organic Jaggery. Feel free to reach out to let us know your thoughts on our ‘gud’ products!
      </Typography>

      <Typography
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          fontSize: '1.2rem',
          // fontWeight: '500',
          color: 'customBrown.main',
          '& a': {
            // fontWeight: 'bold',
            color: 'customBrown.main',
          },
          '& b': {
            fontWeight: '600',
          },
        }}
      >
        <b>Work Hours:</b> Saturday to Thursday, 10:00 am to 7:00 pm
      </Typography>

      <Typography
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          fontSize: '1.2rem',
          // fontWeight: '500',
          color: 'customBrown.main',
          '& a': {
            // fontWeight: 'bold',
            color: 'customBrown.main',
          },
          '& b': {
            fontWeight: '600',
          },
        }}
      >
        <b>Customer Care:</b> <a href="mailto:care@gudworld.in">care@gudworld.in</a> or
      </Typography>

      <Typography
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          fontSize: '1.2rem',
          // fontWeight: '500',
          color: 'customBrown.main',
          '& a': {
            // fontWeight: 'bold',
            color: 'customBrown.main',
          },
          '& b': {
            fontWeight: '600',
          },
        }}
      >
        <b>Call/WhatsApp us:</b> <a href="tel:+918010906093">+91 8010906093</a>
      </Typography>

      <Typography
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          fontSize: '1.2rem',
          // fontWeight: '500',
          color: 'customBrown.main',
          '& a': {
            // fontWeight: 'bold',
            color: 'customBrown.main',
          },
          '& b': {
            fontWeight: '600',
          },
        }}
      >
        <b>Export orders or distributors inquiries:</b> <a href="mailto:Preeti@gudworld.in">Preeti@gudworld.in</a> or
      </Typography>

<Typography
  sx={{
    textAlign: 'center',
    marginBottom: 4,
    fontSize: '1.2rem',
    // fontWeight: '500',
    color: 'customBrown.main',
  }}
>
  Alternatively, you can also fill this form to get in touch with us.
</Typography>

      <Typography
        sx={{
          textAlign: 'center',
          marginBottom: 4,
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'customBrown.main'
        }}
      >
        Contact us
      </Typography>

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ my: 5 }}>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <Field.Text
                name="name"
                label="Name"
                fullWidth
                required
              />
            </Grid>
            <Grid xs={12} md={6}>
              <Field.Text
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid xs={12} md={6}>
              <Field.Text
                name="phoneNumber"
                label="Phone number"
                fullWidth
                required
              />
            </Grid>
            <Grid xs={12} md={6}>
              <Field.Select
                name="purpose"
                label="Purpose"
                fullWidth
                required
              >
                <MenuItem value="">Select an Option</MenuItem>
                <MenuItem value="export">Export Inquiry</MenuItem>
                <MenuItem value="distributor">Distributor Inquiry</MenuItem>
                <MenuItem value="collaboration">Brand Collaboration</MenuItem>
                <MenuItem value="order">Regarding my order</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Field.Select>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Field.Text
              name="message"
              label="Message"
              multiline
              rows={4}
              fullWidth
              required
            />
          </Box>
        </Box>

        <Button type="submit" size="large" variant="contained" color="primary" disabled={isSubmitting}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
