module.exports = {
    apps : [{
        name: "Peepl Stripe Service",
        script: "src/app.js",
        env: {
        NODE_ENV: "development",
        },
        env_production: {
        NODE_ENV: "production",
        }
    }]
}
  