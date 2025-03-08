#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cout << "Enter the number of elements: ";
    cin >> n;

    vector<int> arr(n);
    cout << "Enter the elements: ";
    for (int i = 0; i < n; ++i) {
        cin >> arr[i];
    }

    cout << "Reversed array: ";
    for (int i = n - 1; i >= 0; --i) {
        cout << arr[i] << " ";
    }
    cout << endl;

    return 0;
}