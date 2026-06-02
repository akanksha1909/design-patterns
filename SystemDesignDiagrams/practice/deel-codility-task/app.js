'use strict'

const lodash = require('lodash');
const { v4 } = require('uuid');
const crypto = require('crypto');

const express = require('express');
const app = express();
app.use(express.json());


const users = new Map();
const activeTokens = new Map();
const articles = [];

function getPasswordHash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256').update(salt + password).digest('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password, storedPasswordHash) {
    const [salt, storedHash] = storedPasswordHash.split(':')
    const newHash = crypto.createHash('sha256').update(salt + password).digest('hex');
    return newHash == storedHash;
}

function authMiddleware(req, res, next) {
    const authToken = req.headers['authentication-header'];
    if (!authToken || !activeTokens.has(authToken)) {
        return res.status(401).json({ error: 'Unauthorized User!' });
    }
    const user = activeTokens.get(authToken);
    req.user = user;
    next();
}

function validateBodyMiddleware(req, res, next) {
    if (lodash.isEmpty(req.body)) {
        return res.status(400).json({ error: 'Invalid Request' });
    }
    next();
}

function getPublicArticles() {
    return articles.filter(article => article.visibility === 'public');
}

function getArticleForLoggedInUser(userId) {
    if (!userId) {
        throw new Error('Missing User Id');
    }
    return articles.filter(article => (article.visibility === 'public' || article.visibility === 'logged_in' || article.user_id === userId));
}

function logRequestMiddleware(req, res, next) {
    console.log(`Request received at ${new Date().toISOString()} with body: ${JSON.stringify(req.body, null, 2)}`);
    next();
}

app.use(logRequestMiddleware);

app.post('/api/user', (req, res) => {
    const { user_id, login, password } = req.body;
    if (!user_id || !login || !password) {
        return res.status(400).json({ error: 'Invalid Request' });
    }

    // if (users.has(login)) {
    //     res.status(201).send();
    //     return;
    // }

    const user = {
        id: user_id,
        login,
        password: getPasswordHash(password)
    }

    users.set(login, user);
    return res.status(201).send();
});

app.post('/api/authenticate', validateBodyMiddleware, (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ error: 'Invalid Request' });
        }
        const user = users.get(login);
        if (!user) {
            return res.status(404).json({ error: 'Invalid dCredentials' });
        }
        if (!verifyPassword(password, user.password)) {
            return res.status(401).json({ error: 'Invalid deCredentials' });
        }
        const token = v4();
        activeTokens.set(token, user);
        return res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
});

app.post('/api/logout', authMiddleware, (req, res) => {
    const authToken = req.headers['authentication-header'];
    activeTokens.delete(authToken);
    return res.status(200).send();
});

app.post('/api/articles', validateBodyMiddleware, authMiddleware, (req, res) => {
    const { article_id, title, content, visibility } = req.body;
    if (!article_id || !title || !content || !visibility) {
        return res.status(400).json({ error: 'Invalid Request' });
    }

    const article = {
        article_id,
        title,
        content,
        visibility,
        user_id: req.user.id
    }

    articles.push(article);
    return res.status(201).send();
});

app.get('/api/articles', (req, res) => {
    try {
        const authToken = req.headers['authentication-header'];
        let articles = [];
        if (!authToken || !activeTokens.has(authToken)) {
            articles = getPublicArticles();
        } else {
            const user = activeTokens.get(authToken);
            articles = getArticleForLoggedInUser(user.id);
        }
        return res.json(articles);
    } catch (error) {
        next(error);
    }
});

function errorHandler(error, req, res, next) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong!' })
    next();
}

app.use(errorHandler);

exports.default = app.listen(process.env.HTTP_PORT || 3000);