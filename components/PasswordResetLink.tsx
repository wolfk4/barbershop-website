import Link from "next/link";

interface PasswordResetLinkProps {
    text?: string; 
    className?: string; 
}

/**
 * 
 * @param {PasswordResetLinkProps} props - The properties for the password reset link component.
 * @returns {JSX.Element} A styled link that redirects to password reset page.
 * 
 *  * @example
 * <PasswordResetLink />
 * 
 * @example
 * <PasswordResetLink 
 *   text="Reset your password here" 
 *   className="text-md text-red-500 hover:underline" 
 * />
 */

export default function PasswordResetLink( {
    text = 'Forgot your password?',
    className = 'text-sm text-blue-500 hover:underline',
}: PasswordResetLinkProps) {
    return (
        <div className="text-center mt-4">
            <Link href="/reset-password" className={className}>
                {text}
            </Link>
        </div>
    );
}