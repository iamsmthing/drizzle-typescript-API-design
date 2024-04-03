import jwt from 'jsonwebtoken';
import bcrpyt from 'bcrypt';
import 'dotenv/config'
export const hashPassword = async (password: string) => {
    return bcrpyt.hash(password, 10);

}
export const comparePassword = async (password: string, hash: string) => {

    return bcrpyt.compare(password, hash);
}


export const generateToken = (user: any) => {

    const token = jwt.sign(user, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    return token
}


export const shield = async (req: any, res: any, next: any) => {
    const bearer=req.headers.authorization

    if (!bearer) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const [, token] = bearer.split(' ');
    if(!token){
        return res.status(401).json({ error: 'Not a valid token' });
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
}