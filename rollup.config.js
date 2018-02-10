export default {
    input: 'dist/index.js',
    output: {
        file: 'dist/bundles/drfjwtauth.umd.js',
        sourcemap: false,
        format: 'umd',
        name: 'ng.drfjwtauth',
        external: [
            '@angular/core',
            '@angular/common',
            '@angular/forms',
            '@angular/common/http',
            '@ngrx/effects',
            '@angular/router',
            'rxjs',
            'rxjs/observable/of',
            'rxjs/operators',
            'rxjs/add/operator/do',
            'rxjs/add/operator/map',
            '@ngrx/store',
            '@ngrx/router-store',
            'rxjs/operators/map',
            'rxjs/Observable',
            'rxjs/add/observable/throw',
            'rxjs/add/operator/catch',
],
        globals:
            {
                '@angular/core': 'ng.core',
                '@angular/common': 'ng.common',
                '@angular/common/http': 'ng.common.http',
                '@angular/router': 'ng.router',
                '@angular/forms': 'ng.forms',
                'rxjs/Observable': 'Rx',
                'rxjs/ReplaySubject': 'Rx',
                'rxjs/add/operator/map': 'Rx.Observable.prototype',
                'rxjs/observable/of': 'Rx.Observable',
                'rxjs/operators/map': 'Rx',
                'rxjs/operators': 'Rx',
                'rxjs': 'Rx',

                '@ngrx/store': 'node_modules/@ngrx/store/bundles/store.umd.js',
                '@ngrx/effects': 'node_modules/@ngrx/effects/bundles/effects.umd.js',
                '@ngrx/router-store': 'node_modules/@ngrx/router-store/bundles/router-store.umd.js',
            },

    }
}