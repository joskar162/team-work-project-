import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Library, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { sanitizePayload } from '../utils/security';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, sendOTP, verifyOTP, resetOTPState } = useAuthStore();
  const [step, setStep] = useState('credentials');
  const [email, setEmail] = useState('');

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register: registerOTP,
    handleSubmit: handleOTPSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onLoginSubmit = (values) => {
    const sanitized = sanitizePayload(values);
    const result = login(sanitized);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    setEmail(values.email);
    const otpResult = sendOTP(values.email);
    
    if (!otpResult.ok) {
      toast.error(otpResult.message);
      return;
    }

    toast.success(`OTP sent to ${values.email} (check console in demo)`);
    setStep('otp');
  };

  const onOTPSubmit = (values) => {
    const result = verifyOTP(email, values.otp);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(`Welcome ${result.user.name}`);
    resetOTPState();
    navigate('/');
  };

  const handleBack = () => {
    setStep('credentials');
    resetOTPState();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-600">
            {step === 'otp' ? <ShieldCheck className="w-6 h-6 text-white" /> : <Library className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {step === 'otp' ? 'Verify OTP' : 'Library Access'}
            </h1>
            <p className="text-sm text-slate-500">
              {step === 'otp' ? 'Enter the code sent to your email' : 'Secure login with role-based access'}
            </p>
          </div>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                {...registerLogin('email')}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {loginErrors.email && <p className="text-xs text-red-600 mt-1">{loginErrors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                {...registerLogin('password')}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {loginErrors.password && <p className="text-xs text-red-600 mt-1">{loginErrors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit(onOTPSubmit)} className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700 mb-4">
              Enter the 6-digit OTP sent to {email}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">OTP Code</label>
              <input
                type="text"
                maxLength={6}
                {...registerOTP('otp')}
                placeholder="000000"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
              />
              {otpErrors.otp && <p className="text-xs text-red-600 mt-1">{otpErrors.otp.message}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Verify
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-xs text-slate-500 space-y-1">
          <p>Demo admin: admin@library.com / Admin123!</p>
          <p>Demo librarian: librarian@library.com / Lib12345!</p>
          <p>Demo member: member@library.com / Member123!</p>
        </div>
      </div>
    </div>
  );
}